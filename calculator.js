// Main display element
const displayEl = document.getElementById('display');
const keys = document.getElementById('keys');
const modeBtn = document.getElementById('modeBtn');

// Calculator state variables
let expression = "";
let lastResult = null;
let lastOperation = null;

// Render display
function render() { 
  displayEl.textContent = expression || "0"; 
}

// Safe evaluation using Math functions
function safeEval(expr) {
  expr = expr.replace(/π/g, Math.PI)
             .replace(/e/g, Math.E)
             .replace(/\^/g, '**');
  try { 
    return Function("with(Math){return " + expr + "}")(); 
  } catch { 
    return 'Error'; 
  }
}

// Calculate result
function calculate() {
  const result = safeEval(expression);
  if(result !== 'Error') {
    const match = expression.match(/([+\-*/^].+)$/);
    lastOperation = match ? match[1] : null;
    lastResult = result;
  }
  expression = String(result);
  render();
}

// Clear calculator state
function clearAll() {
  expression = "";
  lastResult = null;
  lastOperation = null;
  render();
}

// Delete last character
function deleteLast() {
  expression = expression.slice(0, -1);
  render();
}

// Handle key/button input
function handleInput(val, action) {
  if(action === 'clear') {
    clearAll();
    return;
  }

  if(action === 'delete') {
    deleteLast();
    return;
  }

  if(action === 'equals') {
    const lastResultStr = lastResult !== null ? String(lastResult) : null;

    if(lastResultStr !== null && expression === lastResultStr && lastOperation) {
      expression = String(safeEval(lastResult + lastOperation));
      lastResult = safeEval(expression);
      render();
      return;
    }

    if(expression === "" && lastResult !== null && lastOperation) {
      expression = String(safeEval(lastResult + lastOperation));
      lastResult = safeEval(expression);
      render();
      return;
    }

    calculate();
    return;
  }

  if(val) {
    expression += val;
    render();
  }
}

// Button click events
keys.addEventListener('click', e => {
  const btn = e.target.closest('button'); 
  if(!btn) return;

  handleInput(btn.dataset.value, btn.dataset.action);
});

// Mode toggle event
modeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  modeBtn.textContent = document.body.classList.contains('dark') ? '⚪' : '⚫';

  // Update button colors according to theme
  document.querySelectorAll('button.key').forEach(btn => {
    btn.style.background = getComputedStyle(document.body).getPropertyValue('--btn-bg');
  });
});

// Keyboard input handling
window.addEventListener('keydown', e => {
  if(/^[0-9+\-*/%^().]$/.test(e.key)) { 
    expression += e.key; 
    render(); 
  } 
  else if(e.key === 'Enter') {
    handleInput(null, 'equals');
  } 
  else if(e.key === 'Backspace') { 
    handleInput(null, 'delete');
  } 
  else if(e.key === 'Escape') { 
    handleInput(null, 'clear');
  }
});

// Detect OS theme and set dark mode if preferred
if(window.matchMedia('(prefers-color-scheme: dark)').matches){
  document.body.classList.add('dark');
  modeBtn.textContent = '⚪';
}

// Initial render
render();