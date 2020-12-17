/*heure*/
const secondHand = document.querySelector('.second-hand');
const minsHand = document.querySelector('.min-hand');
const hourHand = document.querySelector('.hour-hand');

function setDate() {
  const now = new Date();

  const seconds = now.getSeconds();
  const secondsDegrees = ((seconds / 60) * 360) + 90;
  secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

  const mins = now.getMinutes();
  const minsDegrees = ((mins / 60) * 360) + ((seconds/60)*6) + 90;
  minsHand.style.transform = `rotate(${minsDegrees}deg)`;

  const hour = now.getHours();
  const hourDegrees = ((hour / 12) * 360) + ((mins/60)*30) + 90;
  hourHand.style.transform = `rotate(${hourDegrees}deg)`;
}

setInterval(setDate, 1000);

setDate();
/***gallery***/

/*contact*/
const switchers = [...document.querySelectorAll('.switcher')]

switchers.forEach(item => {
	item.addEventListener('click', function() {
		switchers.forEach(item => item.parentElement.classList.remove('is-active'))
		this.parentElement.classList.add('is-active')
	})
})

/**image responsif 1 */
const containrMass = 5;
const mouseMass = 10;

let imageHasLoaded = false;

let mouseX = 0;
let prevMouseX = 0;
let mouseXOnDown = null;
let isMouseDown = false;

let containrPosition = 0;
let mouseVelocity = 0;
let containrVelocity = 0;

let imagesElement = null;

const checkImagesHasLoaded = images => {
  const allImagePromises = images.map(image => {
    return new Promise(resolve => {
      const imageObj = new Image();
      imageObj.onload = () => {
        resolve(imageObj);
      };

      imageObj.src = image;
    });
  });

  return Promise.all(allImagePromises);
};

const createBeltScroller = (containr, images) => {
  checkImagesHasLoaded(images).then(resolvedImages => {
    imageHasLoaded = true;
    const beltDOMItems = images.map((image, index) => {
      const element = document.createElement("div");
      element.classList.add("item");
      element.style.transform = `matrix(1, 0, 0, 1, 0, 0)`;
      element.style.height = `${36 *
        resolvedImages[index].naturalHeight /
        resolvedImages[index].naturalWidth}vw`;
      const elementImage = document.createElement("div");
      elementImage.style.backgroundImage = `url(${image})`;
      element.appendChild(elementImage);
      return element;
    });
    
    imagesElement = beltDOMItems.map(element => element);

    beltDOMItems.forEach(beltDOMItem => {
      containr.appendChild(beltDOMItem);
    });
  });
};

const containr = document.querySelector(".containr");

createBeltScroller(containr, [
  "a.webp",
  "b.webp",
  "c.jpg",
  "d.jpg",
  "f.jpg",
  "h.jpg",
  "b.webp",
  "kitchen-1336160_960_720.jpg",
  "minimal-5000883_960_720.jpg",
  "v.jpg",
]);

const onMouseUpdate = event => {
  mouseX = event.pageX;
};

const onMouseDown = () => {
  isMouseDown = true;
};

const onMouseUp = () => {
  isMouseDown = false;
};

document.addEventListener("mousemove", onMouseUpdate, false);

document.addEventListener("mousedown", onMouseDown);

document.addEventListener("mouseup", onMouseUp);

const calculateMouseMomentum = () => {
  if (isMouseDown) {
    if (mouseXOnDown == null) {
      mouseXOnDown = mouseX;
      containrVelocity = 0;
    }

    const distance = mouseX - mouseXOnDown;

    mouseVelocity = mouseX - prevMouseX;
  } else {
    if (mouseXOnDown != null) {
      containrVelocity =
        2 * mouseMass / (mouseMass + containrMass) * mouseVelocity +
        (containrMass - mouseMass) /
          (mouseMass + containrMass) *
          containrVelocity;

      const maxVelocity = 60;

      if (containrVelocity > maxVelocity) {
        containrVelocity = maxVelocity;
      } else if (containrVelocity < -maxVelocity) {
        containrVelocity = -maxVelocity;
      }

      mouseXOnDown = null;
      mouseVelocity = 0;
    }
  }

  prevMouseX = mouseX;
};

const updateContainr = () => {
  const boundRight = -containr.offsetWidth + window.innerWidth - 85;

  const isOutBound = containrPosition > 0 || containrPosition < boundRight;

  if (!isMouseDown) {
    const mu = 0.04;
    const g = 10;
    const flictionForce = containrMass * g * mu;
    const flictionA = flictionForce / containrMass;

    if (containrVelocity > 0) {
      containrVelocity -= flictionA;
      if (containrVelocity < 0) {
        containrVelocity = 0;
      }
    } else if (containrVelocity < 0) {
      containrVelocity += flictionA;
      if (containrVelocity > 0) {
        containrVelocity = 0;
      }
    }

    if (isOutBound) {
      const k = 0.01;
      const restLength = containrPosition > 0 ? 0 : boundRight;
      const currentLength = containrPosition;
      const dragForce = 1 * k * (restLength - currentLength);

      const dragForceA = dragForce / containrMass;
      containrVelocity += dragForce;

      const nextPosition = containrPosition + containrVelocity;

      if (containrPosition < boundRight && nextPosition > boundRight) {
        containrVelocity = 0;
        containrPosition = boundRight;
      } else if (containrPosition > 0 && nextPosition < 0) {
        containrVelocity = 0;
        containrPosition = 0;
      }
    }
  }

  containrPosition =
    containrPosition +
    containrVelocity +
    (isOutBound ? mouseVelocity / 2 : mouseVelocity);
  
  containr.style.transform = `translate(${containrPosition}px)`;
};

const addOpacityWhenImageInBound = () => {
  if(!imagesElement) {
    return
  }

  imagesElement.forEach((imageElement, index) => {
    const { left, right, width } = imageElement.children[0].getBoundingClientRect();
    if(index === 0) {
      console.log('left', left, width); 
    }
    if (left <= -width || right >= window.innerWidth + width) {
      if(imageElement.classList.contains('show')) {
        imageElement.classList.remove('show');
      } 
    } else {
      if(!imageElement.classList.contains('show')) {
        imageElement.classList.add('show');
      }
    }
  });
};

const loop = () => {
  if (imageHasLoaded) {
    addOpacityWhenImageInBound();
    calculateMouseMomentum();
    updateContainr();
  }
  window.requestAnimationFrame(() => {
    loop();
  });
};

loop();





