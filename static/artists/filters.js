export let creationRange = document.getElementById('creationRange')
export let creationRangeEnd = document.getElementById('creationRangeEnd')
export let creationRangeValueStart = document.getElementById('creationRangeValueStart')
export let creationRangeValueEnd = document.getElementById('creationRangeValueEnd')

export let albumRange = document.getElementById('albumRange')
export let albumRangeEnd = document.getElementById('albumRangeEnd')
export let applyBtn = document.getElementById('apply')

export function syncRangeSliders(slider1, slider2, output1, output2) {
  const minGap = 1; // so they don't overlap

  slider1.addEventListener('input', () => {
    if (parseInt(slider2.value) - parseInt(slider1.value) <= minGap) {
      slider1.value = parseInt(slider2.value) - minGap;
    }
    output1.textContent = slider1.value;
  });

  slider2.addEventListener('input', () => {
    if (parseInt(slider2.value) - parseInt(slider1.value) <= minGap) {
      slider2.value = parseInt(slider1.value) + minGap;
    }
    output2.textContent = slider2.value;
  });
}

