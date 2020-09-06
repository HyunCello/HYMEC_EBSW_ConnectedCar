import cv2

import face_recognition

import numpy as np

import time

from scipy.spatial import distance as dist

# First, check face several times and Keep checking sleep or not


start=time.time()

def get_ear(eye):

	# compute the euclidean distances between the two sets of
	# vertical eye landmarks (x, y)-coordinates
	A = dist.euclidean(eye[1], eye[5])
	B = dist.euclidean(eye[2], eye[4])
 
	# compute the euclidean distance between the horizontal
	# eye landmark (x, y)-coordinates
	C = dist.euclidean(eye[0], eye[3])
 
	# compute the eye aspect ratio
	ear = (A + B) / (2.0 * C)
 
	# return the eye aspect ratio
	return ear
	

video_capture = cv2.VideoCapture(0)

# Load a sample picture and learn how to recognize it.
coon = face_recognition.load_image_file("known_image/coon.jpg")
coon_encoding = face_recognition.face_encodings(coon)[0]

hyun = face_recognition.load_image_file("known_image/hyun.jpg")
hyun_encoding = face_recognition.face_encodings(hyun)[0]

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
    so_encoding,
    gyu_encoding,
    yoon_encoding

]
known_face_names = [
    "Jeong_Seok_Hoon",
    "Kim_Yu_Hyun",
    "Kwon_So_Eun",
    "Lee_Dong_Gyu",
    "Yang_Ji_Yoon"
]

# Initialize some variables
face_locations = []
face_encodings = []
face_names = []
process_this_frame = True

shrink = 0.25

EYES_CLOSED_SECONDS = 3
ID_CHECK=30

closed_count = 0 
id_check_count = 1
process = True
print("start time : ",time.time()-start)

while True:
    
    # Grab a single frame of video
    ret, frame = video_capture.read()
    start=time.time()
    # Resize frame of video to 1/4 size for faster face recognition processing
    small_frame = cv2.resize(frame, (0, 0), fx=shrink, fy=shrink) ############ the more low parameter the more faster fps

    # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
    rgb_small_frame = small_frame[:, :, ::-1]
    
    face_landmarks_list = face_recognition.face_landmarks(rgb_small_frame)
    
    if id_check_count <= ID_CHECK:
        
        # Only process every other frame of video to save time
        if process_this_frame:
            # Find all the faces and face encodings in the current frame of video
            a=time.time()
            face_locations = face_recognition.face_locations(rgb_small_frame)
            face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
            #print("runtime : ",time.time()-a)
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
                    name = known_face_names[best_match_index] ##############################################$$$$ name : name of face
                

                face_names.append(name)
                print(name)
                id_check_count+=1
            
            
            
    
        process_this_frame = not process_this_frame
        
    
    
    #################################################################################################
    if process:
        if face_landmarks_list==[]:
            print("empty")
        

        # get eyes
        for face_landmark in face_landmarks_list:
            left_eye = face_landmark['left_eye']
            right_eye = face_landmark['right_eye']

            ear_left = get_ear(left_eye)
            ear_right = get_ear(right_eye)

            closed = ear_left < 0.2 and ear_right < 0.2
            now=time.time()
            sec=now-start
            fps=1.0/sec
            print("fps : ", fps)      
            if (closed):
                closed_count += 1
            else:
                closed_count = 0
                print("awake")

            if (closed_count >= EYES_CLOSED_SECONDS):
                print("EYES CLOSED")      ##############################################$$$$ eye closed -> sleep
                asleep = True
                while (asleep): 
                    closed_count=0
                    break               
    process = not process
                      
####################################################################################


