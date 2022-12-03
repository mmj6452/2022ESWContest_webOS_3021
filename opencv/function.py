import cv2 as cv

def Turbidity_measurement(image):
    lowerBound = (30, 0, 0)
    upperBound = (80, 255, 200)
    HSV_image = cv.cvtColor(image, cv.COLOR_BGR2HSV)
    H_dst = cv.inRange(HSV_image, lowerBound, upperBound)
    height, width = H_dst.shape[:2]
    pixel_cnt = (height * width)
    # divide the image BGR into 3 parts
    _, g, _ = cv.split(image)
    # multiply the image BGR by the mask
    H_g = cv.bitwise_and(g, H_dst)
    # sum the pixels of the image
    H_g_sum = cv.sumElems(H_g)
    # calculate the average
    Turbidity = H_g_sum[0]/pixel_cnt
    return Turbidity
