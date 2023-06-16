const gnbTab = document.querySelector('.nav')
const gnbTabItemList = gnbTab.querySelectorAll('.nav__link')

let currentActiveTab = gnbTab.querySelector('.nav__item--active')
let disabledUpdating = false 

// 탭 버튼 활성화
function activeTab(e) {
  e.preventDefault();

  const tabItem = this.parentNode  

  if(currentActiveTab !== tabItem) {
    disabledUpdating = true
    tabItem.classList.add('nav__item--active')
    currentActiveTab.classList.remove('nav__item--active')
    currentActiveTab = tabItem

    setTimeout(() => {
      disabledUpdating = false
    }, 1000)
  }
}

gnbTabItemList.forEach((button) => {
  button.addEventListener('click', activeTab);
})

const TOP_HEADER_OFFSET = 72 
const SECTION_PADDING = 50

// 탭 패널로 이동
function scrollToTabPanel() {
  const tabPanelId = this.parentNode.getAttribute('aria-labelledby')

  const tabPanel = document.querySelector(`#${tabPanelId}`)

  const scrollAmount = tabPanel.getBoundingClientRect().top - TOP_HEADER_OFFSET

  window.scrollBy({
    top: scrollAmount, // ?? 얼마나 스크롤 시켜야 하는가 Element.getBoundingClientRect().top
    behavior: 'smooth',
  })
}

gnbTabItemList.forEach((button) => {
  button.addEventListener('click', activeTab)
  button.addEventListener('click', scrollToTabPanel)
})

// 사전정보: 각 tabPanel의 y축 위치 (문서의 시작점에서부터 얼마나 아래에 있는지)
// 요소의 y축 위치 =  window.scrollY + Element.getBoundingClientRect().top

const tabPanelIdList = [
  'section1',
  'section2',
  'section3',
  'section4',
]

const tabPanelList = tabPanelIdList.map((panelId) => {
  const tabPanel = document.querySelector(`#${panelId}`)
  return tabPanel
})

const tabPanelPositionMap = {}

function detectTabPanelPositionMap() {
  // 각각의 tabPanel의 y축 위치를 찾는다
  // tabPanelPositionMap에 그 값을 업데이트
  // ex.
  // {
  //   'section1' : 1000,
  //   'section2' : 2000,
  // }
  console.log(222)

  tabPanelList.forEach((panel) => {
    // id
    // y축 위치
    const id = panel.getAttribute('id')
    const position = window.scrollY + panel.getBoundingClientRect().top

    detectTabPanelPositionMap[id] = position 
  })
}

function updateActiveTabOnScroll() {
  // 스크롤 위치에 따라서 activeTab 업데이트
  // 1. 현재 유저가 얼마만큼 스크롤을 했느냐 -> window.scrollY
  // 2. 각 tabPanel y축 위치 -> tabPanelPositionMap

  console.log(111)

  if (disabledUpdating) {
    return
  }

  const scrolledAmount = window.scrollY + TOP_HEADER_OFFSET + SECTION_PADDING

  let newActiveTab 
  if (scrolledAmount >= detectTabPanelPositionMap['section4']){
    newActiveTab = gnbTabItemList[3]
  }else if (scrolledAmount >= detectTabPanelPositionMap['section3']) {
    newActiveTab = gnbTabItemList[2]
  }else if (scrolledAmount >= detectTabPanelPositionMap['section2']){
    newActiveTab = gnbTabItemList[1]
  }else {
    newActiveTab = gnbTabItemList[0]
  }

  // 추가: 페이지를 끝까지 스크롤 한 경우 newActiveTab = gnbTabItemList[3]
  // window.scrollY + window.innerHeight === body의 전체 height
  // document.body.offsetHeight
  // 

  if(window.scrollY + window.innerHeight === document.body.offsetHeight) {
    newActiveTab = gnbTabItemList[3]
  }

  if (newActiveTab) {
    newActiveTab = newActiveTab.parentNode

    if(newActiveTab !== currentActiveTab) {
      newActiveTab.classList.add('nav__item--active')

      if(currentActiveTab !== null) {
        currentActiveTab.classList.remove('nav__item--active')
      }
      currentActiveTab = newActiveTab
    }
  }
}

window.addEventListener('load', detectTabPanelPositionMap) // 모든 html 요소들이 load 되었을때 훨씬 더 정확하게 위치 정보를 파악할 수 있음

// (Throttle) with lodash : 연속적으로 일어날 가능성이 있는 이벤트의 실행 횟수를 줄여 성능적으로 개선
window.addEventListener('resize', _.throttle(detectTabPanelPositionMap, 500))
window.addEventListener('scroll', _.throttle(updateActiveTabOnScroll, 300))

// window.addEventListener('resize', detectTabPanelPositionMap)
// window.addEventListener('scroll', updateActiveTabOnScroll)