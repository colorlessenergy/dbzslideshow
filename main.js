// list of all the pictures
const PHOTO_LIST = [
  'images/goku.png',
  'images/vegeta.jpg',
  'images/broly.png',
  'images/gohan.jpg',
  'images/piccolo.jpg',
  'images/vegito.png'
];

// creates an image tag and adds src, the parameter, returns the
// img tag with src
function createImage(src) {
  const image = document.createElement('img');
  image.src = src;
  return image;
}


// click on any of the small pictures to grow them
function onThumbnailClick(event) {
  // creates a new image tag with the src of the current image
  // tag clicked on, also with previous eventlistener added
  const image = createImage(event.currentTarget.src);
  // calls showfullsizeimage (adds event listeners)
  showFullsizeImage(image);
  // gives class of no scoll to body which gives the style of
  // overflow hidden
  document.body.classList.add('no-scroll');
  // removes hidden class from the modal view which is the big
  // picture.. style = display
  modalView.classList.remove('hidden');
}

function showFullsizeImage(image) {
  // removes all elements inside the modalview (resets its)
  modalView.innerHTML = '';
  // add event listeners to the image (a drag effect)
  image.addEventListener('pointerdown', startDrag);
  image.addEventListener('pointermove', duringDrag);
  image.addEventListener('pointerup', endDrag);
  image.addEventListener('pointercancel', endDrag);
  // shows the image in the modalview div
  modalView.appendChild(image);
}
// x of the mouse just making it exist also to make it global
let originX = null;
// pretty much sets up the drag..
function startDrag(event) {
  // on desktop there is a default drag behavior disabling it
  event.preventDefault();
  event.stopPropagation();
  // origin x is where mouse i current at
  originX = event.clientX;
  // tracks mouse even if it goes off screen
  event.target.setPointerCapture(event.pointerId);
}

// smooth drag
function duringDrag(event) {
  // only works if originX is not false
  if (originX) {
    // get where the mouse X current at
    const currentX = event.clientX;
    // find the distance between origin and where the X fo mouse is
    const delta = currentX - originX;
    // get the element the event listeners is attached to
    const element = event.currentTarget;
    // translate the element to give a smooth move
    element.style.transform = 'translateX(' + delta + 'px)';
  }
}

function endDrag(event) {
  // check if origin x is a falsy value..
  // stop the funciton running
  if (!originX) {
    return;
  }

  // get current mouse x
  const currentX = event.clientX;
  // smooth drag
  const delta = currentX - originX;
  // modify origin x
  originX = null;

  // if the distance from the current mouse and starting mouse
  // is less than 100 remove all transform
  if (Math.abs(delta) < 100) {
    event.currentTarget.style.transform = '';
    return;
  }

  // assign currentIndex to nextIndex
  let nextIndex = currentIndex;
  // if distance between the current mouse x and origin mouse x
  // is less than 0 add one to next index
  // other wise subtract one to next index
  if (delta < 0) {
    nextIndex++;
  } else {
    nextIndex--;
  }

  // targets last or first image
  // makes them stop from scrolling left for first and right got last img
  if (nextIndex < 0 || nextIndex == PHOTO_LIST.length) {
    event.currentTarget.style.transform = '';
    return;
  }

  //get the next image to scroll too
  const photoSrc = PHOTO_LIST[nextIndex];
  // creates an image tag with the photosrc
  const image = createImage(photoSrc);
  // if the distance between current mouse x and starting mouse X
  // (origin x) add class to make the animation smooth to the right
  // else left
  if (delta < 0) {
    image.classList.add('animate-next');
  } else {
    image.classList.add('animate-prev');
  }
  // make the upcoming image
  // and the event listeners are added to the current image..
  showFullsizeImage(image);
  // makes current index be the next index
  currentIndex = nextIndex;
}

// hides the big image when outer is clicked
function onModalClick() {
  hideModalView();
}

// removes class of no scoll from body
// style = overflow: hidden --removed
// give class of hidden to modalview style = display: hidden
// gets rid of image inside with innerhtml of modalview div
function hideModalView() {
  document.body.classList.remove('no-scroll');
  modalView.classList.add('hidden');
  modalView.innerHTML = '';
}

// makes current index exist
let currentIndex = null;
// displays thumbbnails of the images
const albumView = document.querySelector('#album-view');
for (let i = 0; i < PHOTO_LIST.length; i++) {
  const photoSrc = PHOTO_LIST[i];
  const image = createImage(photoSrc);
  image.dataset.index = i;
  image.addEventListener('pointerdown', onThumbnailClick);
  albumView.appendChild(image);
}

// when anywhere on box, where the image is shown, is clicked it gets rid
// of the view of the image
const modalView = document.querySelector('#modal-view');
modalView.addEventListener('pointerdown', onModalClick);
