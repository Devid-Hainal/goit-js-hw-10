import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const startButtonElement = document.querySelector('button[data-start]');
const timerContainer = document.querySelector('.timer');
const days = timerContainer.querySelector('[data-days]');
const hours = timerContainer.querySelector('[data-hours]');
const minutes = timerContainer.querySelector('[data-minutes]');
const seconds = timerContainer.querySelector('[data-seconds]');

let userSelectedDate = null;
startButtonElement.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startButtonElement.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startButtonElement.disabled = false;
    }
  },
};

flatpickr(input, options);

function startTimer() {
  if (!userSelectedDate) return;
  startButtonElement.disabled = true;
  input.disabled = true;

  const timerInterval = setInterval(() => {
    const currentTime = new Date();
    const timeDifference = userSelectedDate - currentTime;

    if (timeDifference <= 0) {
      clearInterval(timerInterval);
      updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      input.disabled = false;
      startButtonElement.disabled = true;

      iziToast.success({
        title: 'Done',
        message: 'The countdown is over!',
        position: 'topRight',
      });
      return;
    }

    const timeComponents = convertMs(timeDifference);
    updateTimerUI(timeComponents);
  }, 1000);
}

function updateTimerUI({ days: d, hours: h, minutes: m, seconds: s }) {
  days.textContent = addLeadingZero(d);
  hours.textContent = addLeadingZero(h);
  minutes.textContent = addLeadingZero(m);
  seconds.textContent = addLeadingZero(s);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const d = Math.floor(ms / day);
  const h = Math.floor((ms % day) / hour);
  const m = Math.floor(((ms % day) % hour) / minute);
  const s = Math.floor((((ms % day) % hour) % minute) / second);

  return { days: d, hours: h, minutes: m, seconds: s };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

startButtonElement.addEventListener('click', startTimer);
