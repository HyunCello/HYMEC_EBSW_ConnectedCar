import pafy
import numpy as np
import cv2

url = "https://www.youtube.com/watch?v=dBEzkrcniLg"
video = pafy.new(url)
best = video.getbest(preftype="mp4")

capture = cv2.VideoCapture()
capture.open(best.url)

while(True):
    # Capture frame-by-frame
    ret, frame = capture.read()
    #print cap.isOpened(), ret
    if frame is not None:
        # Display the resulting frame
        cv2.imshow('frame',frame)
        # Press q to close the video windows before it ends if you want
        if cv2.waitKey(22) & 0xFF == ord('q'):
            break
    else:
        print("Frame is None")
        break

# When everything done, release the capture
capture.release()
cv2.destroyAllWindows()
print("Video stop")
