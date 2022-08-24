import ScheduleManager from './scheduleManager';

export default class ImageSlider {
  #schduler;
  #currentPosition;
  #sliderWrap;
  #slider;
  #autoBtn;
  #indicatorWrap;
  #nextBtn;
  #prevBtn;
  #slideWidth;
  #positionMax;

  constructor() {
    this.#currentPosition = 0;
    this.#schduler = new ScheduleManager(
      this.#intervalClickEvent.bind(this),
      2.5,
    );
    this.#autoSlider(true);
    this.assignElement();
    this.addEvent();
  }

  assignElement() {
    this.#sliderWrap = document.querySelector('.slider-wrap');
    this.#slider = document.getElementById('slider');
    this.#autoBtn = document.getElementById('control-wrap');
    this.#indicatorWrap = this.#sliderWrap.querySelector('.indicator-wrap ul');
    this.#nextBtn = this.#sliderWrap.querySelector('#next');
    this.#prevBtn = this.#sliderWrap.querySelector('#previous');
    this.#slideWidth = this.#slider.clientWidth;
    this.#positionMax = this.#slider.childElementCount;
  }

  // 이벤트를 연결해주는 함수
  addEvent() {
    this.#autoBtn.addEventListener('click', this.onClickAutoBtn.bind(this));
    this.#nextBtn.addEventListener('click', this.nextSlide.bind(this));
    this.#prevBtn.addEventListener('click', this.previousSlide.bind(this));
    [...this.#indicatorWrap.children].forEach(indicator =>
      indicator.addEventListener('click', this.#onClickIndicatorBtn.bind(this)),
    );
  }

  // 현재 위치에서 1을 더해주는 함수
  #addPosition() {
    this.#currentPosition++;
    if (this.#currentPosition >= this.#positionMax) {
      this.#currentPosition = 0;
      return;
    }
  }

  // 현재 위치에서 1을 빼주는 함수
  #subtractPosition() {
    this.#currentPosition--;
    if (this.#currentPosition < 0) {
      this.#currentPosition = this.#positionMax - 1;
      return;
    }
  }

  // 시작, 정지 버튼에 관련한 이벤트 함수
  onClickAutoBtn(event) {
    const controlWrap = event.target.closest('div');
    const isAuto = !controlWrap.classList.toggle('view');
    this.#autoSlider(isAuto);
  }

  // 이미지가 자동으로 슬라이딩 되는지에 대한 여부를 판별하는 함수
  // 해당 함수는 생성자 함수가 실행될 때 같이 실행이 되야 한다.
  // 그 이유는 페이지에 처음 들어갔을 때 자동으로 실행이 되어야 하기 때문이다.
  #autoSlider(isAuto) {
    if (isAuto) {
      this.#schduler.begin();
    } else {
      this.#schduler.end();
    }
  }

  // 일정 시간마다 클릭이벤트가 자동으로 호출되는 함수
  // 최대한 기능이 중복되지 않도록 따로 함수를 분리했고,
  #intervalClickEvent() {
    const mouseClick = new MouseEvent('click', {
      view: window,
    });
    this.#nextBtn.dispatchEvent(mouseClick);
  }

  // indicator 관련 함수
  // 클릭 및 자동으로 넘어가는 기능에 필요한 함수
  #updateIndicator() {
    // indicator의 전체를 구한 다음 active 효과를 삭제
    // 그 다음 현재 위치에 맞는 요소에 대한 active 효과를 적용
    const listNodes = this.#indicatorWrap.children;
    [...listNodes].forEach(list => list.classList.remove('active'));
    listNodes[this.#currentPosition].classList.add('active');
    // 스타일 설정
    this.#slider.style.left = `-${this.#currentPosition * this.#slideWidth}px`;
  }

  // indicator를 클릭했을 때 직접 발생되는 이벤트 함수
  #onClickIndicatorBtn(event) {
    // html에 설정된 data 속성의 값을 가져온 뒤 현재 위치값으로 덮어쓴다.
    const targetIndex = event.target.dataset.index;
    this.#currentPosition = targetIndex;
    this.#updateIndicator();
    // 이 함수를 실행한 이유는 자동으로 이미지가 넘어가고 있는 도중, 시간이
    // 별로 남지 않았을 때 누르게 되면 클릭한 순간에 이미지가 바로 넘어가기 때문에
    // 타이머를 리셋하고 다시 시작하는 방식으로 구현
    this.#schduler.reset();
  }

  // 다음 버튼을 누르면 다음으로 넘어가는 함수
  nextSlide() {
    this.#addPosition();
    this.#updateIndicator();
  }

  // 이전 버튼을 누르면 이전으로 넘어가는 함수
  previousSlide() {
    this.#subtractPosition();
    this.#updateIndicator();
  }
}
