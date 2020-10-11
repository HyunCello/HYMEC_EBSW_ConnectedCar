import cv2

webcam = cv2.VideoCapture(0)


c=0

while(True):
    ret, frame = webcam.read()
    frame=cv2.resize(frame, dsize=(640, 640), interpolation=cv2.INTER_LINEAR)

    cv2.imshow("img",frame)

    if cv2.waitKey(1) == ord('c'):
        c+=1
        cv2.imwrite("../data/images/%d.jpg" % c, img=frame)
        print("chal kak")
