document.addEventListener('DOMContentLoaded', () => {
  const dashboard = document.querySelector('.dashboard');
  const appContent = document.querySelector('.app-content');
  const toolButtons = document.querySelectorAll('.tool-btn');
  const toolSections = document.querySelectorAll('.tool-section');
  const themeToggle = document.getElementById('theme-toggle');

  // Theme Toggle
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    document.body.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light');
    themeToggle.textContent = currentTheme === 'light' ? '☀️' : '🌙';
  });

  // Tool Navigation
  toolButtons.forEach(button => {
    button.addEventListener('click', () => {
      const toolId = button.dataset.tool;
      dashboard.style.display = 'none';
      appContent.classList.add('active');
      toolSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === `${toolId}-tool`) {
          section.classList.add('active');
        }
      });
    });
  });

  // Increment/Decrement Buttons
  document.querySelectorAll('.increment').forEach(btn => {
    btn.addEventListener('click', () => {
      const inputId = btn.dataset.input;
      const input = document.getElementById(inputId);
      let value = parseInt(input.value) || 0;
      input.value = value + 1;
    });
  });

  document.querySelectorAll('.decrement').forEach(btn => {
    btn.addEventListener('click', () => {
      const inputId = btn.dataset.input;
      const input = document.getElementById(inputId);
      let value = parseInt(input.value) || 0;
      if (value > 1) {
        input.value = value - 1;
      }
    });
  });

  // Ripple Effect for Buttons
  document.querySelectorAll('.tool-btn, .calculate-btn, .increment, .decrement').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // EMI Calculator
  document.getElementById('emi-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const principal = parseFloat(document.getElementById('emi-principal').value);
    const rate = parseFloat(document.getElementById('emi-rate').value) / 12 / 100;
    const tenureUnit = document.getElementById('emi-tenure-unit').value;
    let tenure = parseFloat(document.getElementById('emi-tenure').value);

    if (principal <= 0 || rate <= 0 || tenure <= 0) {
      alert('Please enter valid values');
      return;
    }

    let totalMonths = tenure;
    if (tenureUnit === 'years') {
      totalMonths = tenure * 12;
    }

    const emi = (principal * rate * Math.pow(1 + rate, totalMonths)) / (Math.pow(1 + rate, totalMonths) - 1);
    const totalAmount = emi * totalMonths;
    const totalInterest = totalAmount - principal;

    document.getElementById('emi-result').innerHTML = `
      <p><strong>Calculation Complete!</strong></p>
      <p><strong>Monthly EMI:</strong> ₹${emi.toFixed(2)}</p>
      <p><strong>Tenure:</strong> ${totalMonths} months</p>
      <p><strong>Total Interest:</strong> ₹${totalInterest.toFixed(2)}</p>
      <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
      <div class="share-container">
        <button class="share-btn" data-tool="emi"><i class="fas fa-share-alt"></i> Share</button>
      </div>
    `;

    // Add event listener to the newly created share button
    const shareBtn = document.querySelector('#emi-result .share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', handleShare);
    }
  });

  // FD Calculator
  document.getElementById('fd-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const principal = parseFloat(document.getElementById('fd-principal').value);
    const rate = parseFloat(document.getElementById('fd-rate').value) / 100;
    const tenure = parseFloat(document.getElementById('fd-tenure').value);

    if (principal <= 0 || rate <= 0 || tenure <= 0) {
      alert('Please enter valid values');
      return;
    }

    const maturity = principal * Math.pow(1 + rate / 4, tenure * 4);
    const interest = maturity - principal;

    document.getElementById('fd-result').innerHTML = `
      <p><strong>Calculation Complete!</strong></p>
      <p><strong>Maturity Amount:</strong> ₹${maturity.toFixed(2)}</p>
      <p><strong>Interest Earned:</strong> ₹${interest.toFixed(2)}</p>
      <div class="share-container">
        <button class="share-btn" data-tool="fd"><i class="fas fa-share-alt"></i> Share</button>
      </div>
    `;

    // Add event listener to the newly created share button
    const shareBtn = document.querySelector('#fd-result .share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', handleShare);
    }
  });

  // SIP Calculator
  document.getElementById('sip-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const monthlyAmount = parseFloat(document.getElementById('sip-amount').value);
    const rate = parseFloat(document.getElementById('sip-rate').value) / 12 / 100;
    const tenure = parseFloat(document.getElementById('sip-tenure').value) * 12;

    if (monthlyAmount <= 0 || rate <= 0 || tenure <= 0) {
      alert('Please enter valid values');
      return;
    }

    const futureValue = monthlyAmount * ((Math.pow(1 + rate, tenure) - 1) / rate) * (1 + rate);
    const invested = monthlyAmount * tenure;
    const returns = futureValue - invested;

    document.getElementById('sip-result').innerHTML = `
      <p><strong>Calculation Complete!</strong></p>
      <p><strong>Future Value:</strong> ₹${futureValue.toFixed(2)}</p>
      <p><strong>Invested Amount:</strong> ₹${invested.toFixed(2)}</p>
      <p><strong>Wealth Gained:</strong> ₹${returns.toFixed(2)}</p>
      <div class="share-container">
        <button class="share-btn" data-tool="sip"><i class="fas fa-share-alt"></i> Share</button>
      </div>
    `;

    // Add event listener to the newly created share button
    const shareBtn = document.querySelector('#sip-result .share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', handleShare);
    }
  });

  // PPF Calculator
  document.getElementById('ppf-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const yearlyAmount = parseFloat(document.getElementById('ppf-amount').value);
    const rate = parseFloat(document.getElementById('ppf-rate').value) / 100;
    const tenure = parseFloat(document.getElementById('ppf-tenure').value);

    if (yearlyAmount <= 0 || rate <= 0 || tenure <= 0) {
      alert('Please enter valid values');
      return;
    }

    let balance = 0;
    for (let i = 0; i < tenure; i++) {
      balance = (balance + yearlyAmount) * (1 + rate);
    }

    const invested = yearlyAmount * tenure;
    const interest = balance - invested;

    document.getElementById('ppf-result').innerHTML = `
      <p><strong>Calculation Complete!</strong></p>
      <p><strong>Maturity Amount:</strong> ₹${balance.toFixed(2)}</p>
      <p><strong>Invested Amount:</strong> ₹${invested.toFixed(2)}</p>
      <p><strong>Interest Earned:</strong> ₹${interest.toFixed(2)}</p>
      <div class="share-container">
        <button class="share-btn" data-tool="ppf"><i class="fas fa-share-alt"></i> Share</button>
      </div>
    `;

    // Add event listener to the newly created share button
    const shareBtn = document.querySelector('#ppf-result .share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', handleShare);
    }
  });

  // RD Calculator
  document.getElementById('rd-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const monthlyAmount = parseFloat(document.getElementById('rd-amount').value);
    const rate = parseFloat(document.getElementById('rd-rate').value) / 100;
    const tenure = parseFloat(document.getElementById('rd-tenure').value) * 12;

    if (monthlyAmount <= 0 || rate <= 0 || tenure <= 0) {
      alert('Please enter valid values');
      return;
    }

    const maturity = monthlyAmount * ((Math.pow(1 + rate / 4, tenure / 3) - 1) / (rate / 4)) * (1 + rate / 4);
    const invested = monthlyAmount * tenure;
    const interest = maturity - invested;

    document.getElementById('rd-result').innerHTML = `
      <p><strong>Calculation Complete!</strong></p>
      <p><strong>Maturity Amount:</strong> ₹${maturity.toFixed(2)}</p>
      <p><strong>Invested Amount:</strong> ₹${invested.toFixed(2)}</p>
      <p><strong>Interest Earned:</strong> ₹${interest.toFixed(2)}</p>
      <div class="share-container">
        <button class="share-btn" data-tool="rd"><i class="fas fa-share-alt"></i> Share</button>
      </div>
    `;

    // Add event listener to the newly created share button
    const shareBtn = document.querySelector('#rd-result .share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', handleShare);
    }
  });

  // Income Tax Calculator
  document.getElementById('tax-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const income = parseFloat(document.getElementById('tax-income').value);
    const regime = document.getElementById('tax-regime').value;

    if (income <= 0) {
      alert('Please enter a valid income');
      return;
    }

    let tax = 0;
    if (regime === 'new') {
      if (income <= 300000) tax = 0;
      else if (income <= 600000) tax = (income - 300000) * 0.05;
      else if (income <= 900000) tax = 15000 + (income - 600000) * 0.1;
      else if (income <= 1200000) tax = 45000 + (income - 900000) * 0.15;
      else if (income <= 1500000) tax = 90000 + (income - 1200000) * 0.2;
      else tax = 150000 + (income - 1500000) * 0.3;
    } else {
      if (income <= 250000) tax = 0;
      else if (income <= 500000) tax = (income - 250000) * 0.05;
      else if (income <= 1000000) tax = 12500 + (income - 500000) * 0.2;
      else tax = 112500 + (income - 1000000) * 0.3;
    }

    document.getElementById('tax-result').innerHTML = `
      <p><strong>Calculation Complete!</strong></p>
      <p><strong>Estimated Tax:</strong> ₹${tax.toFixed(2)}</p>
      <p><strong>Regime:</strong> ${regime === 'new' ? 'New' : 'Old'}</p>
      <div class="share-container">
        <button class="share-btn" data-tool="tax"><i class="fas fa-share-alt"></i> Share</button>
      </div>
    `;

    // Add event listener to the newly created share button
    const shareBtn = document.querySelector('#tax-result .share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', handleShare);
    }
  });

  // GST Calculator
  document.getElementById('gst-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('gst-amount').value);
    const rate = parseFloat(document.getElementById('gst-rate').value) / 100;

    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const gst = amount * rate;
    const total = amount + gst;

    document.getElementById('gst-result').innerHTML = `
      <p><strong>Calculation Complete!</strong></p>
      <p><strong>GST Amount:</strong> ₹${gst.toFixed(2)}</p>
      <p><strong>Total Amount:</strong> ₹${total.toFixed(2)}</p>
      <div class="share-container">
        <button class="share-btn" data-tool="gst"><i class="fas fa-share-alt"></i> Share</button>
      </div>
    `;

    // Add event listener to the newly created share button
    const shareBtn = document.querySelector('#gst-result .share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', handleShare);
    }
  });

  // Loan Eligibility Calculator
  document.getElementById('loan-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const income = parseFloat(document.getElementById('loan-income').value);
    const expenses = parseFloat(document.getElementById('loan-expenses').value);
    const rate = parseFloat(document.getElementById('loan-rate').value) / 12 / 100;
    const tenure = parseFloat(document.getElementById('loan-tenure').value) * 12;

    if (income <= 0 || expenses < 0 || rate <= 0 || tenure <= 0) {
      alert('Please enter valid values');
      return;
    }

    const disposableIncome = income - expenses;
    const maxEMI = disposableIncome * 0.5;
    const loanAmount = maxEMI * (Math.pow(1 + rate, tenure) - 1) / (rate * Math.pow(1 + rate, tenure));

    document.getElementById('loan-result').innerHTML = `
      <p><strong>Calculation Complete!</strong></p>
      <p><strong>Eligible Loan Amount:</strong> ₹${loanAmount.toFixed(2)}</p>
      <p><strong>Max EMI:</strong> ₹${maxEMI.toFixed(2)}</p>
      <div class="share-container">
        <button class="share-btn" data-tool="loan"><i class="fas fa-share-alt"></i> Share</button>
      </div>
    `;

    // Add event listener to the newly created share button
    const shareBtn = document.querySelector('#loan-result .share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', handleShare);
    }
  });

  // NPV Calculator
  document.getElementById('npv-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const initial = parseFloat(document.getElementById('npv-initial').value);
    const rate = parseFloat(document.getElementById('npv-rate').value) / 100;
    const flows = document.getElementById('npv-flows').value.split(',').map(Number);

    if (initial <= 0 || rate <= 0 || flows.some(isNaN)) {
      alert('Please enter valid values');
      return;
    }

    let npv = -initial;
    flows.forEach((flow, i) => {
      npv += flow / Math.pow(1 + rate, i + 1);
    });

    document.getElementById('npv-result').innerHTML = `
      <p><strong>Calculation Complete!</strong></p>
      <p><strong>Net Present Value:</strong> ₹${npv.toFixed(2)}</p>
      <p><strong>Status:</strong> ${npv > 0 ? 'Profitable' : 'Not Profitable'}</p>
      <div class="share-container">
        <button class="share-btn" data-tool="npv"><i class="fas fa-share-alt"></i> Share</button>
      </div>
    `;

    // Add event listener to the newly created share button
    const shareBtn = document.querySelector('#npv-result .share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', handleShare);
    }
  });

  // USD to INR Converter
  let exchangeRate = 86.15; // Fallback rate
  const usdInput = document.getElementById('inr-usd');
  const inrInput = document.getElementById('inr-inr');
  const resultDiv = document.getElementById('inr-result');

  // Fetch live exchange rate
  fetch('https://v6.exchangerate-api.com/v6/91a897205b0d33df5624c07e/latest/USD')
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        exchangeRate = data.conversion_rates.INR;
      } else {
        console.error('API error:', data);
        alert('Failed to fetch exchange rate. Using fallback rate.');
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      alert('Failed to fetch exchange rate. Using fallback rate.');
    });

  usdInput.addEventListener('input', () => {
    inrInput.value = '';
    resultDiv.innerHTML = '';
  });

  inrInput.addEventListener('input', () => {
    usdInput.value = '';
    resultDiv.innerHTML = '';
  });

  document.getElementById('inr-convert').addEventListener('click', () => {
    const usd = parseFloat(usdInput.value);
    const inr = parseFloat(inrInput.value);

    if (usd && !inr) {
      if (usd <= 0) {
        alert('Please enter a valid USD amount');
        return;
      }
      const converted = usd * exchangeRate;
      inrInput.value = converted.toFixed(2);
      resultDiv.innerHTML = `
        <p><strong>Calculation Complete!</strong></p>
        <p><strong>USD:</strong> $${usd.toFixed(2)}</p>
        <p><strong>INR:</strong> ₹${converted.toFixed(2)}</p>
        <p><strong>Rate:</strong> 1 USD = ₹${exchangeRate.toFixed(2)}</p>
        <div class="share-container">
          <button class="share-btn" data-tool="inr"><i class="fas fa-share-alt"></i> Share</button>
        </div>
      `;

      // Add event listener to the newly created share button
      const shareBtn = document.querySelector('#inr-result .share-btn');
      if (shareBtn) {
        shareBtn.addEventListener('click', handleShare);
      }
    } else if (inr && !usd) {
      if (inr <= 0) {
        alert('Please enter a valid INR amount');
        return;
      }
      const converted = inr / exchangeRate;
      usdInput.value = converted.toFixed(2);
      resultDiv.innerHTML = `
        <p><strong>Calculation Complete!</strong></p>
        <p><strong>INR:</strong> ₹${inr.toFixed(2)}</p>
        <p><strong>USD:</strong> $${converted.toFixed(2)}</p>
        <p><strong>Rate:</strong> 1 USD = ₹${exchangeRate.toFixed(2)}</p>
        <div class="share-container">
          <button class="share-btn" data-tool="inr"><i class="fas fa-share-alt"></i> Share</button>
        </div>
      `;

      // Add event listener to the newly created share button
      const shareBtn = document.querySelector('#inr-result .share-btn');
      if (shareBtn) {
        shareBtn.addEventListener('click', handleShare);
      }
    } else {
      alert('Please enter an amount in either USD or INR');
    }
  });

  // Swap Icon for USD to INR
  document.querySelector('.swap-icon').addEventListener('click', () => {
    const usdValue = usdInput.value;
    usdInput.value = inrInput.value;
    inrInput.value = usdValue;
    resultDiv.innerHTML = '';
  });

  // CAGR Calculator
  document.getElementById('cagr-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const initial = parseFloat(document.getElementById('cagr-initial').value);
    const final = parseFloat(document.getElementById('cagr-final').value);
    const tenure = parseFloat(document.getElementById('cagr-tenure').value);

    if (initial <= 0 || final <= 0 || tenure <= 0) {
      alert('Please enter valid values');
      return;
    }

    const cagr = (Math.pow(final / initial, 1 / tenure) - 1) * 100;

    document.getElementById('cagr-result').innerHTML = `
      <p><strong>Calculation Complete!</strong></p>
      <p><strong>CAGR:</strong> ${cagr.toFixed(2)}%</p>
      <p><strong>Initial Value:</strong> ₹${initial.toFixed(2)}</p>
      <p><strong>Final Value:</strong> ₹${final.toFixed(2)}</p>
      <div class="share-container">
        <button class="share-btn" data-tool="cagr"><i class="fas fa-share-alt"></i> Share</button>
      </div>
    `;

    // Add event listener to the newly created share button
    const shareBtn = document.querySelector('#cagr-result .share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', handleShare);
    }
  });

  // Simple Interest Calculator
  document.getElementById('si-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const principal = parseFloat(document.getElementById('si-principal').value);
    const rate = parseFloat(document.getElementById('si-rate').value) / 100;
    const tenure = parseFloat(document.getElementById('si-tenure').value);

    if (principal <= 0 || rate <= 0 || tenure <= 0) {
      alert('Please enter valid values');
      return;
    }

    const interest = principal * rate * tenure;
    const total = principal + interest;

    document.getElementById('si-result').innerHTML = `
      <p><strong>Calculation Complete!</strong></p>
      <p><strong>Simple Interest:</strong> ₹${interest.toFixed(2)}</p>
      <p><strong>Total Amount:</strong> ₹${total.toFixed(2)}</p>
      <p><strong>Principal:</strong> ₹${principal.toFixed(2)}</p>
      <div class="share-container">
        <button class="share-btn" data-tool="si"><i class="fas fa-share-alt"></i> Share</button>
      </div>
    `;

    // Add event listener to the newly created share button
    const shareBtn = document.querySelector('#si-result .share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', handleShare);
    }
  });

  // Share functionality
  function handleShare(event) {
    const resultDiv = event.target.closest('.result');
    const resultText = resultDiv.textContent.replace('Share', '').trim(); // Remove the Share button text
    const calculatorName = event.target.closest('.tool-section').querySelector('h2').textContent;
    const shareMessage = `📊 ${calculatorName} Results\n\n${resultText}\n\n💡 Want to make such ${calculatorName} calculations yourself? Download India Finance App - Your trusted financial companion!`;

    if (navigator.share) {
      navigator.share({
        title: `${calculatorName} Results`,
        text: shareMessage
      }).catch(error => {
        console.log('Error sharing:', error);
        // Fallback to clipboard if share fails
        navigator.clipboard.writeText(shareMessage)
          .then(() => alert('Results copied to clipboard!'))
          .catch(err => console.error('Failed to copy:', err));
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareMessage)
        .then(() => alert('Results copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
    }
    
    // Prevent the default behavior and stop event propagation
    event.preventDefault();
    event.stopPropagation();
  }

  // Add event listeners to all share buttons
  document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to all share buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
      button.addEventListener('click', handleShare);
    });
  });

  // Clear result and share button when inputs change
  document.querySelectorAll('input[type="number"], input[type="text"], select').forEach(input => {
    input.addEventListener('input', () => {
      const formId = input.closest('form').id;
      if (formId) {
        const resultId = formId.replace('-form', '-result');
        const resultElement = document.getElementById(resultId);
        if (resultElement) {
          resultElement.innerHTML = '';
        }
      }
    });
  });

  // Clear result and share button when form is reset
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('reset', () => {
      const resultId = form.id.replace('-form', '-result');
      const resultElement = document.getElementById(resultId);
      if (resultElement) {
        resultElement.innerHTML = '';
      }
    });
  });

  // Clear result when switching between tools
    toolButtons.forEach(button => {
      button.addEventListener('click', () => {
      document.querySelectorAll('.result').forEach(result => {
        result.innerHTML = '';
        });
      });
    });
  });