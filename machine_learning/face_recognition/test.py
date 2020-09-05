import cv2

import face_recognition

import numpy as np

import time

start=time.time()


video_capture = cv2.VideoCapture(0)

# Load a sample picture and learn how to recognize it.
coon = face_recognition.load_image_file("known_image/coon.jpg")
coon_encoding = face_recognition.face_encodings(coon)[0]

hyun = face_recognition.load_image_file("known_image/hyun.jpg")
hyun_encoding = face_recognition.face_encodings(hyun)[0]

yong = face_recognition.load_image_file("known_image/yong.jpg")
yong_encoding = face_recognition.face_encodings(yong)[0]

so = face_recognition.load_image_file("known_image/so.jpg")
so_encoding = face_recognition.face_encodings(so)[0]

gyu = face_recognition.load_image_file("known_image/gyu.jpg")
gyu_encoding = face_recognition.face_encodings(gyu)[0]

yoon = face_recognition.load_image_file("known_image/yoon.jpg")
yoon_encoding = face_recognition.face_encodings(yoon)[0]

# Create arrays of known face encodings and their names
known_face_encodings = [
    coon_encoding,
    hyun_encoding,
    yong_encoding,
    so_encoding,
    gyu_encoding,
    yoon_encoding

]
known_face_names = [
    "Jeong_Seok_Hoon",
    "Kim_Yu_Hyun",
    "Jo_Jeong_Yong",
    "Kwon_So_Eun",
    "Lee_Dong_Gyu",
    "Yang_Ji_Yoon"
]

# Initialize some variables
face_locations = []
face_encodings = []
face_names = []
process_this_frame = True
print("start time : ",time.time()-start)
while True:   
    # Grab a single frame of video
    ret, frame = video_capture.read()
    now=time.time()
    # Resize frame of video to 1/4 size for faster face recognition processing
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

    # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
    rgb_small_frame = small_frame[:, :, ::-1]

    # Only process every other frame of video to save time
    if process_this_frame:
        # Find all the faces and face encodings in the current frame of video
        a=time.time()
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
        print("runtime : ",time.time()-a)
        face_names = []
        for face_encoding in face_encodings:
            # See if the face is a match for the known face(s)
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"

            # # If a match was found in known_face_encodings, just use the first one.
            # if True in matches:
            #     first_match_index = matches.index(True)
            #     name = known_face_names[first_match_index]

            # Or instead, use the known face with the smallest distance to the new face
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                name = known_face_names[best_match_index] ############################################## name : name of face
                

            face_names.append(name)
            print(name)
            sec=now-start
            fps=1.0/sec
            print("fps : ", fps)
            
            
    
    process_this_frame = not process_this_frame
    
    start=time.time()


