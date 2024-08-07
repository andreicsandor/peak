import { globalManager } from "../managers/globalManager";
import { convertPaceToVelocity } from "../utils/mathUtils";

export function addPaceSelector(minutes = 5, seconds = 30) {
  const paceWrapper = document.querySelector(".dashboard-pace-wrapper");

  const contentMarkup = `
    <div class="dashboard-pace-container">
      <div class="pace-selector">
        <div class="pace-inputs">
          <input type="text" class="pace-minutes-input" value="${minutes}">
          <span>'</span>
          <input type="text" class="pace-seconds-input" value="${seconds}">
          <span>''</span>
        </div>
        <div class="dashboard-pace-title">Pace</div>
      </div>
    </div>
  `;

  paceWrapper.innerHTML = contentMarkup;

  const minutesInput = paceWrapper.querySelector(".pace-minutes-input");
  const secondsInput = paceWrapper.querySelector(".pace-seconds-input");

  attachPaceInputEvents(minutesInput, secondsInput);
}

function enforceNumericInput(input) {
  input.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
  });
}

function handleMouseWheel(event, input, min, max) {
  event.preventDefault();
  
  const scrollThreshold = 50;
  let scrollAmount = input.dataset.scrollAmount ? parseInt(input.dataset.scrollAmount) : 0;
  scrollAmount += event.deltaY;

  if (Math.abs(scrollAmount) >= scrollThreshold) {
    const delta = Math.sign(scrollAmount);
    let value = parseInt(input.value, 10);

    if (isNaN(value)) {
      value = 0;
    }

    value -= delta;
    if (value < min) {
      value = max;
    } else if (value > max) {
      value = min;
    }

    input.value = value;
    input.dispatchEvent(new Event('change'));

    scrollAmount = 0;
  }

  input.dataset.scrollAmount = scrollAmount;
}

function attachPaceInputEvents(minutesInput, secondsInput) {
  const signalPaceChange = () => {
    let minutes = parseInt(minutesInput.value, 10);
    let seconds = parseInt(secondsInput.value, 10);
    
    if (!isNaN(minutes) && !isNaN(seconds)) {
      if (minutes === 0 && seconds === 0) {
        seconds = 1;
        secondsInput.value = seconds;
      }
      handlePaceSelect(minutes, seconds);
    }
  };

  minutesInput.addEventListener("change", signalPaceChange);
  secondsInput.addEventListener("change", signalPaceChange);
  
  enforceNumericInput(minutesInput);
  enforceNumericInput(secondsInput);
  
  minutesInput.addEventListener("wheel", (event) => handleMouseWheel(event, minutesInput, 0, 9));
  secondsInput.addEventListener("wheel", (event) => handleMouseWheel(event, secondsInput, 0, 59));
}

async function handlePaceSelect(minutes, seconds) {
  const velocity = convertPaceToVelocity(minutes, seconds);
  globalManager.getManagers().eventBus.publish("paceChanged", velocity);
}
