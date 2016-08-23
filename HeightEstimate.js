// The CameraVideoPageController is a class that controls the camera 
// video page.  This class provides a some useful methods you will
// need to call:
//     cameraVideoPage.displayMessage(message, timeout):
//         Causes a short message string to be displayed on the
//         page for a brief period.  Useful for showing quick
//         notifications to the user.  message is a plain string.
//         timeout is option and denotes the length of time in msec
//         to show the message for.
//     cameraVideoPage.setHeadsUpDisplayHTML(html):
//         This will set or update the heads-up-display with the
//         text given in the html argument.  Usually this should 
//         just be a string with text and line breaks (<br />).

 // Given an HTML element class and a boolean representing
    // whether those elements should be displayed, this function
    // hides/shows all elements with that class.
    // ======================================================================
    //   Orientation/compass sensor code (deviceOrientation)
    // ======================================================================    


// Initialise the camera video page and callback to our 
// cameraVideoPageInitialised() function when ready.
var axisY, userInputHeight, BaseDistance, finalHeight, UpperHeight, angleBase, angleApex;
var cameraVideoPage = new CameraVideoPageController(cameraVideoPageInitialised);

// You may need to create variables to store state.
    
// This function will be called when the camera video page
// is intialised and ready to be used.
function cameraVideoPageInitialised(event)
{
    // Step 1: Check for and intialise deviceMotion
    
    var temp = 0;
    var max = 100000;
    for (i = 1; i <= max; i++)
        {
            var run = event.beta;
            temp += run;
        }
    var average = (temp/max).toFixed(2);
    axisY = event.beta;
    if (BaseDistance === undefined && finalHeight === undefined && userInputHeight === undefined || userInputHeight === null)
        {
            cameraVideoPage.setHeadsUpDisplayHTML("beta: " + average);
        }
    else if (BaseDistance === undefined && finalHeight === undefined)
        {
            cameraVideoPage.setHeadsUpDisplayHTML("beta: " + average + "\n" + "<br />" + "Height of Device: " + userInputHeight+ "m");
        }
    else if (finalHeight === undefined)
        {
            cameraVideoPage.setHeadsUpDisplayHTML("beta: " + average + "\n" + "<br />" + "Height of Device: " + userInputHeight + "m" + "\n" + "<br />" + "Object Distance: " + BaseDistance.toFixed(2) + "m");
        }
    else {
        cameraVideoPage.setHeadsUpDisplayHTML("beta: " + average + "\n" + "<br />" + "Height of Device: " + userInputHeight + "m" + "\n" + "<br />" + "Object Distance: " + BaseDistance.toFixed(2) + "m" + "\n" + "<br />" + "Object Height: " + finalHeight.toFixed(2) + "m");
    }
}

window.addEventListener('deviceorientation',cameraVideoPageInitialised);
    
// This function is called by a button to set the height of phone from the
// ground, in metres.

function setCameraHeightValue()
{
    // Step 3: Set camera height
    // check if input is a number and is positive
    // display on screen using the displayMessage method
    userInputHeight = prompt("Please enter your estimated camera height (meter)");
    if (userInputHeight != null)
    {
        while (isNaN(userInputHeight) || userInputHeight <=0)
        {
            alert("Your entry is not a number or it is a negative value");
            userInputHeight = prompt("Please enter your estimated camera height");
        }
    }
    
    if (BaseDistance === undefined && finalHeight === undefined)
    {
        ;
    }
    else if (finalHeight === undefined)
    {
        BaseDistance = estimatedDistance();
    }
    else {
        BaseDistance = estimatedDistance();
        UpperHeight = upperHeight(angleApex);
        finalHeight = estimatedHeight();
    }
}

    
// This function is called by a button to set the angle to the base of
// the object being measured.  It uses the current smoothed tilt angle.
function setBaseTiltAngle()
{
    // Step 4: Record tilt angle 
    // display on screen using the displayMessage method
    angleBase = axisY;
    
    if (angleBase < 0 || angleBase > 90)
    {
        alert("Out of Range.");
    }
    else if (angleBase === 0)
    {
        alert("You are the Object.");
    }
    else if (angleBase === 90)
        {
            alert("Object distance is infinity.");
        }
    else {
        if (userInputHeight === undefined || userInputHeight === null)
        {setCameraHeightValue()}
        else {;}
        
        BaseDistance = estimatedDistance();
        cameraVideoPage.displayMessage("Base Tilt Angle: " + angleBase.toFixed(2), 1000);
        
        if (finalHeight === undefined) {;}
        else {
            UpperHeight = upperHeight(angleApex);
            finalHeight = estimatedHeight();
        }
    }
}

// This function is called by a button to set the angle to the apex of
// the object being measured.  It uses the current smoothed tilt angle.
function setApexTiltAngle()
{
    // Step 4: Record tilt angle 
    // display on screen using the displayMessage method
    angleApex = axisY;
    if (BaseDistance === Infinity)
    {
        alert("Object Distance is Infinity." + "<br />" + "Unable to calculate Object Height.")
    }
    else if (angleApex < 0)
    {
        alert("Out of Range.")
    }
    else if (angleApex === 0 || angleApex === 180)
    {
        alert("You are the Object.")
    }
    else {
        if (userInputHeight === undefined || userInputHeight === null)
        {
            alert("Object Distance is not calculated." + "\n" + "Height is not calculated.")
        }
        else {;}
        
        UpperHeight = upperHeight(angleApex);
        finalHeight = estimatedHeight();
        cameraVideoPage.displayMessage("Apex Tilt Angle: " + angleApex.toFixed(2), 1000);
    }
}

// You may need to write several other functions.

// This function is used to calculate the estimated distance to the object
function estimatedDistance()
{
    // convert from degree to radian
    var convertRadian1 = Math.abs(angleBase-90) * Math.PI / 180;
    // calculate distance to the object
    var distance = Number(userInputHeight) / Math.tan(convertRadian1);
    return distance;
}


function upperHeight(angle)
{
    // convert from degree to radian
    if (angle === 90)
    {
        var result = Number(userInputHeight);
    }
    else {
        var convertRadian2 = Math.abs(90-angle) * Math.PI / 180;
        // calculate the height difference
        var result = Math.tan(convertRadian2) * BaseDistance;
    }
    return result;
}

function estimatedHeight()
{
    var inverted = upperHeight(angleApex);
    if (angleApex === 90)
    {
        var result = Number(userInputHeight);
    }
    else if (angleApex > 90 && angleBase < angleApex)
    {
        var result = UpperHeight + Number(userInputHeight);
    }
    else if (angleApex < 90 && angleBase < angleApex)
    {
        var result = Number(userInputHeight) - UpperHeight;
    }
    else if (angleApex < 90 && angleBase >  angleApex)
    {
        var inverted = upperHeight(angleBase);
        alert("Object is inverted." + inverted);
        var result = UpperHeight - inverted;
    }
    return result;
}