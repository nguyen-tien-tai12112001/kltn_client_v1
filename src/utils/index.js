import confetti from 'canvas-confetti';
export const formatNumber = (x) => {
  if (x && x !== 'null' && x !== 'undefined') {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return 0;
  }
};

export const getSalePrice = (price, percent) => {
  return Math.ceil((price / 100) * (100 - percent));
};

export const splitFullName = (fullName) => {
  const partials = fullName.split(' ');

  return {
    last_name: partials.pop(),
    first_name: partials.join(' '),
  };
};

export const runFireworks = () => {
  var duration = 5 * 1000;
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  var interval = setInterval(function () {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
};
