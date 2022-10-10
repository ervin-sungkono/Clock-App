_id = (id) => {
    return document.getElementById(id);
}

_class = (className) => {
    return document.getElementsByClassName(className);
}

// Navigations
let mainSections = _class('main-section');
let navLinks = _class('nav-link');
let active = 0;

let navDict = {
    'timer': 0,
    'stopwatch': 1,
    'clock' : 2
};

setActive = (activeElement) => {
    navLinks[active].classList.remove('active');
    mainSections[active].classList.remove('active');
    active = navDict[activeElement];
    navLinks[active].classList.add('active');
    mainSections[active].classList.add('active');
}

// Dark Mode
toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    _id('toggle-btn-circle').classList.toggle('active')
}

// Timer Input Validation
validateTime = (id, maxValue) => {
    let element = _id(id);
    if(element.value > maxValue){
        element.value = maxValue;
    }else if(element.value < 0){
        element.value = 0;
    }
    element.value = Math.round(element.value);
}

let indicatorBar = _id('indicator-bar');

const barShrinking = [
    { width: '100%' },
    { width: '0%' }
];

// Timer Functions
var state = 'init';

let startButton = _id('start-btn');
let pauseButton = _id('pause-btn');
let resetButton = _id('reset-btn');

let hoursField = _id('hours');
let minutesField = _id('minutes');
let secondsField = _id('seconds');

let errorMessage = _id('error-message');

pauseButton.style.display = 'none';

let timerDisplay = _id('timer');
let duration = 0;

let alarmRingtone = new Audio('./assets/alarm-ringtone.wav');
alarmRingtone.volume = 0.5;

updateTimer = () =>{
    if(state ==='init') return;
    if(state === 'playing'){
        seconds = parseInt(duration % 60);
        minutes = parseInt(duration % 3600 / 60);
        hours = parseInt(duration / 3600);
    
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
    
        timerDisplay.innerHTML = hours + ":" + minutes + ":" + seconds;
    
        duration--;
        if(duration < 0){
            timerDisplay.classList.add('running');
            let i = 0, maxLoop = 2;
            alarmRingtone.play();
            let alarmLoop = setInterval(()=>{
                i++
                alarmRingtone.play();
                if(i >= maxLoop) clearInterval(alarmLoop);
            },1500);
            return;
        } 
    }
    setTimeout(() => updateTimer(),1000);
}

startTimer = () => { 
    if(state === 'init'){
        let hours = parseInt(hoursField.value);
        let minutes = parseInt(minutesField.value);
        let seconds = parseInt(secondsField.value);
        duration = (hours*3600) + (minutes*60) + seconds;
        if(duration <= 0){
            errorMessage.innerHTML = "Please set a valid time!"
            setTimeout(()=>{
                errorMessage.innerHTML = ""
            },3000);
        }else{
            startButton.style.display = 'none';
            pauseButton.style.display = 'block';
            state = 'playing';
            updateTimer();
            indicatorBar.style.animationDuration = (duration+1) +'s';
            indicatorBar.classList.add('running');
        }
    }else if(state === 'paused'){
        startButton.style.display = 'none';
        pauseButton.style.display = 'block';
        state = 'playing';
        indicatorBar.style.animationPlayState = 'running';
    }
}

pauseTimer = () => {
    state = 'paused';
    startButton.style.display = 'block';
    pauseButton.style.display = 'none';
    indicatorBar.style.animationPlayState = 'paused';
}

resetTimer = () => {
    state = 'init';
    startButton.style.display = 'block';
    pauseButton.style.display = 'none';
    hoursField.value = 0;
    minutesField.value = 0;
    secondsField.value = 0;
    timerDisplay.innerHTML = '00:00:00';
    indicatorBar.style.animationPlayState = 'running';
    indicatorBar.classList.remove('running');
    timerDisplay.classList.remove('running');
}

// Stopwatch Functions
let watchState = 'init';

let stopwatch = _id('stopwatch');
let time = 0;
let tens = 0;

updateStopwatch = () => {
    if(watchState === 'running'){
        tens++;

        if(tens > 99){
            time++;
            tens %= 100;
        }
    
        let seconds = parseInt(time % 60);
        let minutes = parseInt(time % 3600 / 60);
        let hours = parseInt(time / 3600);
    
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
    
        stopwatch.innerHTML = hours + ":" + minutes + ":" + seconds + ' <span>'+ ((tens < 10) ? "0" + tens : tens) + '</span>';
    }
}

let stopWatchInterval;

startStopwatch = () => {
    if(watchState === 'init'){
        setTimeout(() => {
            updateStopwatch();
            stopWatchInterval = setInterval(updateStopwatch, 10);
        });
    }
    watchState = 'running';
}

pauseStopwatch = () => {
    if(watchState === 'running'){
        watchState = 'paused';
    } 
}

resetStopwatch = () => {
    watchState = 'init';
    clearInterval(stopWatchInterval);
    tens = 0;
    time = 0;
    stopwatch.innerHTML = "00:00:00 <span>00</span>";
}

// Clock Functions
let session = " AM";

let clockDisplay = _id('time-indicator');
let dateDisplay = _id('date-indicator');

let hourPointer = _id('hour-pointer');
let minutePointer = _id('minute-pointer');
let secondPointer = _id('second-pointer');

const dateOptions = {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'}

animateHours = (hours) => {
    hourPointer.animate([
        {transform: "rotate("+(hours*30)+"deg)"},
        {transform: "rotate("+((1+hours)*30)+"deg)"}
    ],60*60*1000);
    setTimeout(()=>animateHours(hours+1),60*60*1000);
}

animateMinutes = (minutes) => {
    minutePointer.animate([
        {transform: "rotate("+(minutes*6)+"deg)"},
        {transform: "rotate("+((1+minutes)*6)+"deg)"}
    ],60*1000);
    setTimeout(()=>animateMinutes(minutes+1), 60*1000);
}

animateSeconds = (seconds) => {
    secondPointer.animate([
        {transform: "rotate("+(seconds*6)+"deg)"},
        {transform: "rotate("+((1+seconds)*6)+"deg)"}
    ],1000);
    setTimeout(()=>animateSeconds(seconds+1), 1000);
}

setClockAnimation = () => {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    hourPointer.style.transform = "rotate("+(hours*30 + (30*minutes/60))+"deg)";
    minutePointer.style.transform = "rotate("+(minutes*6 + (6*seconds/60))+"deg)";
    secondPointer.style.transform = "rotate("+(seconds*6)+"deg)";

    animateSeconds(seconds);
    animateMinutes(minutes + (seconds/60));
    animateHours(hours + (minutes/60));
}

updateClock = () => {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    
    session = (hours >= 12) ? " PM" : " AM";
    clockDisplay.innerHTML = (hours < 10 ? "0" + hours : hours) + ":" + 
        (minutes < 10 ? "0" + minutes : minutes) + 
        session;

    dateDisplay.innerHTML = new Date().toLocaleDateString('en-GB', dateOptions);
}

setTimeout(()=>{
    setClockAnimation();
    updateClock();
    setInterval(updateClock, 1000);
})
