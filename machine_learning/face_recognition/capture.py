import cv2
 
webcam = cv2.VideoCapture(0)

while(True):
    ret, frame = webcam.read()

    file_name="yoon.jpg"
    
    cv2.imshow("img",frame)

    if cv2.waitKey(1) == ord('c'):
        cv2.imwrite(file_name, img=frame)
        print("chal kak")

