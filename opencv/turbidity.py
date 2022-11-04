import cv2 as cv

lowerBound = (30, 0, 0)
upperBound = (80, 255, 200)

# High turbidity
src = cv.imread("opencv/img/high.jpg")
src_hsv = cv.cvtColor(src, cv.COLOR_BGR2HSV)
dst = cv.inRange(src_hsv, lowerBound, upperBound)
cv.imshow("High", dst)
height, width = dst.shape[:2]
print("High", cv.countNonZero(dst) / (height * width))

# Low turbidity
src = cv.imread("opencv/img/low.jpg")
src_hsv = cv.cvtColor(src, cv.COLOR_BGR2HSV)
dst = cv.inRange(src_hsv, lowerBound, upperBound)
cv.imshow("Low", dst)
height, width = dst.shape[:2]
print("Low", cv.countNonZero(dst) / (height * width))


'''                 <For test>
src = cv.imread("C:/Users/64527/Downloads/test_img.png")
src_hsv = cv.cvtColor(src, cv.COLOR_BGR2HSV)
dst = cv.inRange(src_hsv, lowerBound, upperBound)
cv.imshow("test", dst)
cv.imshow("test_src",src)
height, width = dst.shape[:2]
print("test", cv.countNonZero(dst) / (height * width))
'''
cv.waitKey()
