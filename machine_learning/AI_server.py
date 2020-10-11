# -*- coding: utf-8 -*-
from flask import Flask, render_template, Response
from flask_socketio import SocketIO, emit
from flask_cors import CORS, cross_origin

import random
import os
import platform
import shutil
import time
from pathlib import Path
from scipy.spatial import distance as dist
import face_recognition
import numpy as np
import time
import cv2
import torch
import torch.backends.cudnn as cudnn
from numpy import random


from models.experimental import attempt_load
from utils.datasets import LoadStreams, LoadImages
from utils.general import (check_img_size, non_max_suppression, apply_classifier, scale_coords, xyxy2xywh, plot_one_box, strip_optimizer, set_logging)
from utils.torch_utils import select_device, load_classifier, time_synchronized


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app,cors_allowed_origins='*')

#* ObjectDetection Korean classes
trunk_classes=["아이스백","더플백","캐리어","캐디백","백팩"]
scene_classes=["비양도","풍력발전기","성산일출봉","카이트서핑"]


#* Known Face Images Loading & Camera On 
#*###################################################################################################
#* Load a sample picture and learn how to recognize it.
hyun = face_recognition.load_image_file("known_image/hyun.jpg")
hyun_encoding = face_recognition.face_encodings(hyun)[0]

yoon = face_recognition.load_image_file("known_image/yoon.jpg")
yoon_encoding = face_recognition.face_encodings(yoon)[0]

#* Create arrays of known face encodings and their names
known_face_encodings = [hyun_encoding, yoon_encoding]
known_face_names = ["김유현","양지윤"]


#* Camera On
video_capture = cv2.VideoCapture(1)

#* Calculate the distance between each eye points in known face images
def get_eye_distance(eye):

    #* compute the euclidean distances between the two sets of
    #* vertical eye landmarks (x, y)-coordinates
    A = dist.euclidean(eye[1], eye[5])
    B = dist.euclidean(eye[2], eye[4])

    #* compute the euclidean distance between the horizontal
    #* eye landmark (x, y)-coordinates
    C = dist.euclidean(eye[0], eye[3])

    #* compute the eye aspect ratio
    distance = (A + B) / (2.0 * C)

    #* return the eye aspect ratio
    return distance

#* get images from webcam and calculate face_landmarks by using "face_recognition" Package
def get_face(shrink = 0.25):

    ret, frame = video_capture.read()
    frame=cv2.rotate(frame,cv2.ROTATE_90_COUNTERCLOCKWISE)

    #* Resize frame of video to 1/4 size for faster face recognition processing
    small_frame = cv2.resize(frame, (0, 0), fx=shrink, fy=shrink) #* the more lower parameter the more faster fps

    rgb_small_frame = small_frame[:, :, ::-1]

    face_landmarks_list = face_recognition.face_landmarks(rgb_small_frame)
    return face_landmarks_list, rgb_small_frame

#* Calculate how close the eyes are
def eye_check():
    #* get eyes
    closed_count = 0
    EYES_CLOSED_SECONDS = 2
    
    for i in range(4):
        face_landmarks_list, rgb_small_frame=get_face()
        for face_landmark in face_landmarks_list:
            left_eye = face_landmark['left_eye']
            right_eye = face_landmark['right_eye']

            ear_left = get_eye_distance(left_eye)
            ear_right = get_eye_distance(right_eye)

            closed = ear_left < 0.2 and ear_right < 0.2

            if (closed):
                closed_count += 1
                print("closed")
            else:
                closed_count = 0
                #print("awake")

            if (closed_count >= EYES_CLOSED_SECONDS):
                print("\n\nEYES CLOSED\n\n")      #! eye closed -> sleep
                return True
#*###################################################################################################

#* route the local host
@app.route('/')
def index():
    """Video streaming home page."""
    return render_template('index.html')

#* connect socketio for communication between server and host
@socketio.on('connect')
def connect():
    emit("response", {'data': 'Connected'})

#* generating object detected images and classes from YOLOv5 model and response the data
def gen(exte='',source='',weights=''):
    """Video streaming generator function."""
    #* initial
    #* ======================================================================
    view_img, save_txt, save_img, update, augment, agnostic_nms   = True, False, False, True, True, True
    source=source
    weights=weights
    conf_thres=0.4
    iou_thres=0.5
    imgsz=640
    device=''
    classes=None
    name_io=[]
    i_c=0
    #* ======================================================================
    webcam = source.isnumeric() or source.startswith('rtsp') or source.startswith('http') or source.endswith('.txt')

    set_logging()
    device = select_device(device)
    half = device.type != 'cpu'  # half precision only supported on CUDA

    #* Load model
    model = attempt_load(weights, map_location=device)  # load FP32 model
    imgsz = check_img_size(imgsz, s=model.stride.max())  # check img_size

    if half:
        model.half()  #* to FP16

    save_img = True
    dataset = LoadImages(source, img_size=imgsz)

    #* Get names and colors
    names = model.module.names if hasattr(model, 'module') else model.names
    if exte=='image': name_io=trunk_classes
    else: name_io=scene_classes
    colors = [[random.randint(0, 255) for _ in range(3)] for _ in range(len(names))]

    #* Start inference
    t0 = time.time()
    img = torch.zeros((1, 3, imgsz, imgsz), device=device)  # init img
    _ = model(img.half() if half else img) if device.type != 'cpu' else None  # run once

    if exte=='image':
        socketio.emit("toast",{'data':'camera','image':'2'})
    else:
        socketio.emit("toast",{'data':'video','image':'2'})

    for path, img, im0s, vid_cap in dataset:

        img = torch.from_numpy(img).to(device)
        img = img.half() if half else img.float()  # uint8 to fp16/32
        img /= 255.0  # 0 - 255 to 0.0 - 1.0
        if img.ndimension() == 3:
            img = img.unsqueeze(0) #* vectorize the image
        #* Inference
        t1 = time_synchronized()
        pred = model(img, augment=augment)[0] #* Predict the Input Data

        #* Apply NMS
        pred = non_max_suppression(pred, conf_thres, iou_thres, classes=classes, agnostic=agnostic_nms)#?????
        t2 = time_synchronized()
        #* return detection data shape : (x1, y1, x2, y2, conf, cls)


        #* Process detections
        for i, det in enumerate(pred):  #* detections per image

            if webcam:  #* batch_size >= 1
                p, s, im0 = path[i], '%g: ' % i, im0s[i].copy()
            else:
                p, s, im0 = path, '', im0s

            s += '%gx%g ' % img.shape[2:]  #* print string
            gn = torch.tensor(im0.shape)[[1, 0, 1, 0]] 
            if det is not None and len(det):
                #* Rescale boxes from img_size to im0 size
                det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()

                #* Print results
                for c in det[:, -1].unique():
                    n = (det[:, -1] == c).sum()  #* detections per class
                    s += '%g %ss, ' % (n, names[int(c)])  #* add to string


                #* Write results
                for *xyxy, conf, cls in reversed(det):


                    label = '%s %.2f' % (names[int(cls)], conf)
                    plot_one_box(xyxy, im0, label=label, color=colors[int(cls)], line_thickness=1)
                    print(name_io[int(cls)])
                    socketio.emit("yolo",{'data':str(name_io[int(cls)]),'image':'1'})

            #* Check User's eyes every 3 frames
            if i_c%3==0:
                if eye_check():
                    print("stop")
                    socketio.emit("eye",{'data':'1'}) #* Check if the user is asleep.

            im0=cv2.resize(im0, dsize=(1200, 900), interpolation=cv2.INTER_LINEAR)
            i_c+=1
            frame = cv2.imencode('.jpg', im0)[1].tobytes() #* Encoding for Web streaming
            yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n') #* send to web


@app.route('/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(gen(exte='video',source='./EBSW_source/media/movie/jeju.mp4',weights='./EBSW_source/weights/scene_weight.pt'),mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/image_feed')
def image_feed():
    sources=['./EBSW_source/media/trunk_1.jpg',
    './EBSW_source/media/trunk_2.jpg',
    './EBSW_source/media/trunk_3.jpg',
    './EBSW_source/media/trunk_4.jpg'] #* Known Trunk images
    source=random.choice(sources) #* Random Choice the Trunk images
    return Response(gen(exte='image',source=source,weights='./EBSW_source/weights/trunk_weight.pt'),mimetype='multipart/x-mixed-replace; boundary=frame')


@socketio.on('facerecog')
def face_check():
    #* Initialize some variables
    face_locations = []
    face_encodings = []
    face_names = []
    process_this_frame = True

    ID_CHECK=3

    id_check_count = 1
    process = True

    #* Check User's face for login
    for i in range(ID_CHECK):
        face_landmarks_list, rgb_small_frame=get_face()
        if face_landmarks_list==[]:
                print("empty")

        if process_this_frame:

            face_locations = face_recognition.face_locations(rgb_small_frame)
            face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

            face_names = []

            for face_encoding in face_encodings:
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                name = "Unknown"

                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = known_face_names[best_match_index]

                face_names.append(name)
                print(name)
                socketio.emit('user',{'data':str(name),'check':'1'}) #!@

        process_this_frame = not process_this_frame #* switch for calculate the Face frame by frame

#! ###################################################################################

if __name__ == '__main__':

    socketio.run(app,host="0.0.0.0",port=5000) #* run the server by commend