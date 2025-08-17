// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByl8nNi16tW1Y-p4ENLfRUMxryEi6Rli0",
  authDomain: "introduce-backend.firebaseapp.com",
  projectId: "introduce-backend",
  storageBucket: "introduce-backend.firebasestorage.app",
  messagingSenderId: "280481000866",
  appId: "1:280481000866:web:deaf62516cca85f41396fb",
  databaseURL: "https://introduce-backend-default-rtdb.firebaseio.com/"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Global variables
let currentUser = null;
let visitorCount = 0;

// 페이지네이션 관련 변수
let currentPage = 1;
let itemsPerPage = 3;
let currentFilter = 'all';

// 스킬 페이지네이션 관련 변수
let currentSkillPage = 1;
let skillItemsPerPage = 3;
let currentSkillFilter = 'all';



/* ========================================
   포트폴리오 웹사이트 JavaScript
   Hanna Lee 포트폴리오
   ======================================== */

// ========================================
// DOM 로드 완료 후 실행되는 메인 함수
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeFirebase();
    initializeNavigation();
    initializeScrollEffects();
    initializeSmoothScroll();
    initializeSkillAnimations();
    initializeProjectFilters();
    initializeScrollAnimations();
    initializeModal();
    initializeContactForm();
    initializeTypingAnimation();
    initializeHoverEffects();
    initializeScrollProgress();
    initializePageLoadEffects();
    initializeVisitorCounter();
    initializeProjectData();
    initializePagination();
    initializeSkillFilters();
    initializeSkillPagination();
});

// ========================================
// Firebase 초기화
// ========================================
async function initializeFirebase() {
    try {
        // 익명 인증으로 사용자 식별
        await signInAnonymously(auth);
        
        // 인증 상태 모니터링
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUser = user;
                console.log('Firebase 인증 완료:', user.uid);
            } else {
                console.log('사용자 로그아웃');
            }
        });
    } catch (error) {
        console.error('Firebase 초기화 오류:', error);
    }
}

// ========================================
// 방문자 카운터
// ========================================
async function initializeVisitorCounter() {
    try {
        // 방문자 수 증가
        const visitorRef = collection(db, 'visitors');
        await addDoc(visitorRef, {
            timestamp: new Date(),
            userAgent: navigator.userAgent,
            userId: currentUser ? currentUser.uid : 'anonymous'
        });

        // 총 방문자 수 표시
        const visitorCountRef = collection(db, 'visitorCount');
        const q = query(visitorCountRef, orderBy('timestamp', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const lastDoc = querySnapshot.docs[0];
            visitorCount = lastDoc.data().count + 1;
        } else {
            visitorCount = 1;
        }

        // 방문자 수 업데이트
        await addDoc(visitorCountRef, {
            count: visitorCount,
            timestamp: new Date()
        });

        // UI에 방문자 수 표시
        updateVisitorDisplay();
    } catch (error) {
        console.error('방문자 카운터 오류:', error);
    }
}

function updateVisitorDisplay() {
    const visitorElement = document.querySelector('.visitor-count');
    if (visitorElement) {
        visitorElement.textContent = `방문자: ${visitorCount.toLocaleString()}명`;
    }
}

// ========================================
// 프로젝트 데이터 관리
// ========================================
async function initializeProjectData() {
    try {
        // Firestore에서 프로젝트 데이터 로드
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const projects = [];
        querySnapshot.forEach((doc) => {
            projects.push({ id: doc.id, ...doc.data() });
        });

        // 프로젝트 데이터가 있으면 UI 업데이트
        if (projects.length > 0) {
            updateProjectsUI(projects);
        }
    } catch (error) {
        console.error('프로젝트 데이터 로드 오류:', error);
    }
}

function updateProjectsUI(projects) {
    // 프로젝트 카드 동적 업데이트 로직
    console.log('프로젝트 데이터 로드됨:', projects);
}

// ========================================
// 네비게이션 관련 기능
// ========================================
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // 햄버거 메뉴 토글
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 네비게이션 링크 클릭 시 메뉴 닫기
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ========================================
// 스크롤 효과 관련 기능
// ========================================
function initializeScrollEffects() {
    // 스크롤 시 네비게이션 스타일 변경
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
}

// ========================================
// 부드러운 스크롤 기능
// ========================================
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// 스킬 바 애니메이션
// ========================================
function initializeSkillAnimations() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.style.width;
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// ========================================
// 프로젝트 필터링 기능 (페이지네이션 포함)
// ========================================
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 활성 버튼 변경
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // 필터 변경 및 페이지 리셋
            currentFilter = this.getAttribute('data-filter');
            currentPage = 1;
            
            // 프로젝트 필터링 및 페이지네이션 적용
            filterAndPaginateProjects();
        });
    });
}

// ========================================
// 페이지네이션 초기화
// ========================================
function initializePagination() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const paginationNumbers = document.getElementById('paginationNumbers');

    // 이전 버튼 이벤트
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            filterAndPaginateProjects();
        }
    });

    // 다음 버튼 이벤트
    nextBtn.addEventListener('click', function() {
        const totalPages = getTotalPages();
        if (currentPage < totalPages) {
            currentPage++;
            filterAndPaginateProjects();
        }
    });

    // 초기 페이지네이션 적용
    filterAndPaginateProjects();
}

// ========================================
// 프로젝트 필터링 및 페이지네이션
// ========================================
function filterAndPaginateProjects() {
    const projectCards = document.querySelectorAll('.project-card');
    const filteredCards = [];

    // 필터링된 카드들 수집
    projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (currentFilter === 'all' || category === currentFilter) {
            filteredCards.push(card);
        }
    });

    // 모든 카드 숨기기
    projectCards.forEach(card => {
        card.style.display = 'none';
    });

    // 현재 페이지에 해당하는 카드들만 표시
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageCards = filteredCards.slice(startIndex, endIndex);

    currentPageCards.forEach((card, index) => {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.5s ease';
        // 애니메이션 지연 효과
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // 페이지네이션 업데이트
    updatePagination(filteredCards.length);
}

// ========================================
// 총 페이지 수 계산
// ========================================
function getTotalPages() {
    const projectCards = document.querySelectorAll('.project-card');
    const filteredCards = [];

    projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (currentFilter === 'all' || category === currentFilter) {
            filteredCards.push(card);
        }
    });

    return Math.ceil(filteredCards.length / itemsPerPage);
}

// ========================================
// 페이지네이션 UI 업데이트
// ========================================
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const paginationNumbers = document.getElementById('paginationNumbers');

    // 이전/다음 버튼 상태 업데이트
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    // 페이지 번호 생성
    paginationNumbers.innerHTML = '';
    
    if (totalPages <= 1) {
        // 페이지가 1개 이하면 페이지네이션 숨기기
        document.getElementById('pagination').style.display = 'none';
        return;
    } else {
        document.getElementById('pagination').style.display = 'flex';
    }

    // 최대 5개의 페이지 번호만 표시
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // 시작 페이지 조정
    if (endPage - startPage < 4) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + 4);
        } else {
            startPage = Math.max(1, endPage - 4);
        }
    }

    // 페이지 번호 버튼 생성
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', function() {
            currentPage = i;
            filterAndPaginateProjects();
        });
        paginationNumbers.appendChild(pageBtn);
    }
}

// ========================================
// 스킬 필터링 기능
// ========================================
function initializeSkillFilters() {
    const skillFilterButtons = document.querySelectorAll('.skill-filter-btn');

    skillFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 활성 버튼 변경
            skillFilterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // 필터 변경 및 페이지 리셋
            currentSkillFilter = this.getAttribute('data-skill-filter');
            currentSkillPage = 1;
            
            // 스킬 필터링 및 페이지네이션 적용
            filterAndPaginateSkills();
        });
    });
}

// ========================================
// 스킬 페이지네이션 초기화
// ========================================
function initializeSkillPagination() {
    const skillPrevBtn = document.getElementById('skillPrevBtn');
    const skillNextBtn = document.getElementById('skillNextBtn');
    const skillPaginationNumbers = document.getElementById('skillPaginationNumbers');

    // 이전 버튼 이벤트
    skillPrevBtn.addEventListener('click', function() {
        if (currentSkillPage > 1) {
            currentSkillPage--;
            filterAndPaginateSkills();
        }
    });

    // 다음 버튼 이벤트
    skillNextBtn.addEventListener('click', function() {
        const totalPages = getTotalSkillPages();
        if (currentSkillPage < totalPages) {
            currentSkillPage++;
            filterAndPaginateSkills();
        }
    });

    // 초기 스킬 페이지네이션 적용
    filterAndPaginateSkills();
}

// ========================================
// 스킬 필터링 및 페이지네이션
// ========================================
function filterAndPaginateSkills() {
    const skillCategories = document.querySelectorAll('.skill-category');
    const filteredSkills = [];

    // 필터링된 스킬 카테고리들 수집
    skillCategories.forEach(category => {
        const skillCategory = category.getAttribute('data-skill-category');
        if (currentSkillFilter === 'all' || skillCategory === currentSkillFilter) {
            filteredSkills.push(category);
        }
    });

    // 모든 스킬 카테고리 숨기기
    skillCategories.forEach(category => {
        category.style.display = 'none';
    });

    // 현재 페이지에 해당하는 스킬 카테고리들만 표시
    const startIndex = (currentSkillPage - 1) * skillItemsPerPage;
    const endIndex = startIndex + skillItemsPerPage;
    const currentPageSkills = filteredSkills.slice(startIndex, endIndex);

    currentPageSkills.forEach((category, index) => {
        category.style.display = 'block';
        category.style.animation = 'fadeIn 0.5s ease';
        // 애니메이션 지연 효과
        category.style.animationDelay = `${index * 0.1}s`;
    });

    // 스킬 페이지네이션 업데이트
    updateSkillPagination(filteredSkills.length);
}

// ========================================
// 스킬 총 페이지 수 계산
// ========================================
function getTotalSkillPages() {
    const skillCategories = document.querySelectorAll('.skill-category');
    const filteredSkills = [];

    skillCategories.forEach(category => {
        const skillCategory = category.getAttribute('data-skill-category');
        if (currentSkillFilter === 'all' || skillCategory === currentSkillFilter) {
            filteredSkills.push(category);
        }
    });

    return Math.ceil(filteredSkills.length / skillItemsPerPage);
}

// ========================================
// 스킬 페이지네이션 UI 업데이트
// ========================================
function updateSkillPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / skillItemsPerPage);
    const skillPrevBtn = document.getElementById('skillPrevBtn');
    const skillNextBtn = document.getElementById('skillNextBtn');
    const skillPaginationNumbers = document.getElementById('skillPaginationNumbers');

    // 이전/다음 버튼 상태 업데이트
    skillPrevBtn.disabled = currentSkillPage === 1;
    skillNextBtn.disabled = currentSkillPage === totalPages;

    // 페이지 번호 생성
    skillPaginationNumbers.innerHTML = '';
    
    if (totalPages <= 1) {
        // 페이지가 1개 이하면 페이지네이션 숨기기
        document.getElementById('skillPagination').style.display = 'none';
        return;
    } else {
        document.getElementById('skillPagination').style.display = 'flex';
    }

    // 최대 5개의 페이지 번호만 표시
    let startPage = Math.max(1, currentSkillPage - 2);
    let endPage = Math.min(totalPages, currentSkillPage + 2);

    // 시작 페이지 조정
    if (endPage - startPage < 4) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + 4);
        } else {
            startPage = Math.max(1, endPage - 4);
        }
    }

    // 페이지 번호 버튼 생성
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `skill-page-number ${i === currentSkillPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', function() {
            currentSkillPage = i;
            filterAndPaginateSkills();
        });
        skillPaginationNumbers.appendChild(pageBtn);
    }
}

// ========================================
// 스크롤 애니메이션
// ========================================
function initializeScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
}

// ========================================
// 모달 창 기능
// ========================================
function initializeModal() {
    const modal = document.getElementById('videoModal');
    const closeBtn = document.querySelector('.close');

    // 닫기 버튼 클릭
    closeBtn.addEventListener('click', function() {
        closeModal();
    });

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // 모달 내부 스크롤 방지
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            e.stopPropagation();
        }
    });
}

// 모달 닫기 함수
function closeModal() {
    const modal = document.getElementById('videoModal');
    const video = modal.querySelector('video');
    
    // 비디오가 재생 중이면 정지
    if (video && !video.paused) {
        video.pause();
    }
    
    modal.style.display = 'none';
}

// ========================================
// 연락처 폼 기능 (Firebase 연동)
// ========================================
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 폼 데이터 수집
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // 유효성 검사
        if (!name || !email || !subject || !message) {
            showNotification('모든 필드를 입력해주세요.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('올바른 이메일 주소를 입력해주세요.', 'error');
            return;
        }

        try {
            // Firestore에 메시지 저장
            const messagesRef = collection(db, 'messages');
            await addDoc(messagesRef, {
                name: name,
                email: email,
                subject: subject,
                message: message,
                timestamp: new Date(),
                userId: currentUser ? currentUser.uid : 'anonymous',
                read: false
            });

            showNotification('메시지가 성공적으로 전송되었습니다!', 'success');
            this.reset();
        } catch (error) {
            console.error('메시지 전송 오류:', error);
            showNotification('메시지 전송에 실패했습니다. 다시 시도해주세요.', 'error');
        }
    });
}

// ========================================
// 타이핑 애니메이션
// ========================================
function initializeTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // 페이지 로드 후 타이핑 시작
        setTimeout(typeWriter, 500);
    }
}

// ========================================
// 호버 효과
// ========================================
function initializeHoverEffects() {
    // 스킬 카테고리 호버 효과
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        category.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 프로젝트 카드 호버 효과
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
}

// ========================================
// 스크롤 진행률 표시
// ========================================
function initializeScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(90deg, #3498db, #2980b9)';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.3s ease';
    
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// ========================================
// 페이지 로드 효과
// ========================================
function initializePageLoadEffects() {
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
        
        // 스킬 바 애니메이션 지연 실행
        setTimeout(() => {
            const skillBars = document.querySelectorAll('.skill-progress');
            skillBars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.opacity = '1';
                }, index * 200);
            });
        }, 1000);
    });
}

// ========================================
// 유틸리티 함수들
// ========================================

// 이메일 유효성 검사 함수
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 알림 표시 함수
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 스타일 적용
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.color = 'white';
    notification.style.fontWeight = '500';
    notification.style.zIndex = '3000';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease';
    
    if (type === 'success') {
        notification.style.background = '#27ae60';
    } else {
        notification.style.background = '#e74c3c';
    }

    document.body.appendChild(notification);

    // 애니메이션
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // 자동 제거
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ========================================
// 비디오 재생 함수 (Firebase Storage 연동)
// ========================================
async function playVideo(videoId) {
    const modal = document.getElementById('videoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    // 기존 비디오 정지
    const existingVideo = modal.querySelector('video');
    if (existingVideo) {
        existingVideo.pause();
    }
    
    // 로딩 표시
    modalTitle.textContent = '로딩 중...';
    modalBody.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div class="loading-spinner"></div>
            <p>비디오를 불러오는 중입니다...</p>
        </div>
    `;
    modal.style.display = 'block';
    
    try {
        // Firebase Storage에서 비디오 URL 가져오기
        let videoUrl = '';
        if (videoId === 'japanese-video') {
            const videoRef = ref(storage, 'videos/sing.mp4');
            videoUrl = await getDownloadURL(videoRef);
        }
        
        // 비디오 데이터 (Firebase에서 동적으로 로드 가능)
        const videoData = {
            'portfolio-video': {
                title: '포트폴리오 웹사이트 개발',
                content: `
                    <div style="text-align: center;">
                        <div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; margin-bottom: 1rem;">
                            <i class="fas fa-laptop-code" style="font-size: 3rem; color: #3498db; margin-bottom: 1rem;"></i>
                            <p>포트폴리오 웹사이트 개발 과정</p>
                            <p>HTML, CSS, JavaScript를 활용한 반응형 웹사이트 개발 과정입니다.</p>
                        </div>
                        <p><strong>프로젝트:</strong> 개인 포트폴리오 웹사이트</p>
                        <p><strong>기술 스택:</strong> HTML, CSS, JavaScript, Firebase</p>
                        <p><strong>개발 기간:</strong> 2주</p>
                        <p><strong>주요 기능:</strong> 반응형 디자인, Firebase 연동, 모달 창, 애니메이션</p>
                    </div>
                `
            },
            'react-video': {
                title: 'React 웹 애플리케이션 개발',
                content: `
                    <div style="text-align: center;">
                        <div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; margin-bottom: 1rem;">
                            <i class="fab fa-react" style="font-size: 3rem; color: #3498db; margin-bottom: 1rem;"></i>
                            <p>React 웹 애플리케이션 개발 과정</p>
                            <p>React를 활용한 동적 웹 애플리케이션 개발 과정입니다.</p>
                        </div>
                        <p><strong>프로젝트:</strong> React 웹 애플리케이션</p>
                        <p><strong>기술 스택:</strong> React, JavaScript, CSS, API</p>
                        <p><strong>개발 기간:</strong> 3개월</p>
                        <p><strong>주요 기능:</strong> 컴포넌트 기반 개발, 상태 관리, API 연동</p>
                    </div>
                `
            },
            'nodejs-video': {
                title: 'Node.js 백엔드 API 개발',
                content: `
                    <div style="text-align: center;">
                        <div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; margin-bottom: 1rem;">
                            <i class="fab fa-node-js" style="font-size: 3rem; color: #3498db; margin-bottom: 1rem;"></i>
                            <p>Node.js 백엔드 API 개발 과정</p>
                            <p>Express.js를 활용한 RESTful API 서버 개발 과정입니다.</p>
                        </div>
                        <p><strong>프로젝트:</strong> RESTful API 서버</p>
                        <p><strong>기술 스택:</strong> Node.js, Express, MongoDB</p>
                        <p><strong>개발 기간:</strong> 1개월</p>
                        <p><strong>주요 기능:</strong> CRUD API, 데이터베이스 연동, 인증 시스템</p>
                    </div>
                `
            },
            'firebase-video': {
                title: 'Firebase 연동 웹앱 개발',
                content: `
                    <div style="text-align: center;">
                        <div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; margin-bottom: 1rem;">
                            <i class="fas fa-fire" style="font-size: 3rem; color: #3498db; margin-bottom: 1rem;"></i>
                            <p>Firebase 연동 웹앱 개발 과정</p>
                            <p>Firebase 서비스를 활용한 풀스택 웹 애플리케이션 개발 과정입니다.</p>
                        </div>
                        <p><strong>프로젝트:</strong> Firebase 연동 웹앱</p>
                        <p><strong>기술 스택:</strong> Firebase, Authentication, Firestore, Storage</p>
                        <p><strong>개발 기간:</strong> 2개월</p>
                        <p><strong>주요 기능:</strong> 사용자 인증, 실시간 데이터베이스, 파일 업로드</p>
                    </div>
                `
            },
            'rpa-video': {
                title: 'RPA 자동화 시스템 개발',
                content: `
                    <div style="text-align: center;">
                        <div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; margin-bottom: 1rem;">
                            <i class="fas fa-robot" style="font-size: 3rem; color: #3498db; margin-bottom: 1rem;"></i>
                            <p>RPA 자동화 시스템 개발 과정</p>
                            <p>Brity RPA와 OutSystems를 활용한 업무 자동화 시스템 개발 과정입니다.</p>
                        </div>
                        <p><strong>프로젝트:</strong> 업무 자동화 시스템</p>
                        <p><strong>기술 스택:</strong> Brity RPA, OutSystems, Low-Code</p>
                        <p><strong>개발 기간:</strong> 3개월</p>
                        <p><strong>주요 기능:</strong> 업무 프로세스 자동화, 워크플로우 관리</p>
                    </div>
                `
            },
            'ai-video': {
                title: 'AI 융합 스마트 시스템 개발',
                content: `
                    <div style="text-align: center;">
                        <div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; margin-bottom: 1rem;">
                            <i class="fas fa-brain" style="font-size: 3rem; color: #3498db; margin-bottom: 1rem;"></i>
                            <p>AI 융합 스마트 시스템 개발 과정</p>
                            <p>인공지능 기반 스마트 관리시스템 개발 과정입니다.</p>
                        </div>
                        <p><strong>프로젝트:</strong> AI 스마트 관리시스템</p>
                        <p><strong>기술 스택:</strong> Python, AI, 머신러닝, 데이터 분석</p>
                        <p><strong>개발 기간:</strong> 4개월</p>
                        <p><strong>주요 기능:</strong> 데이터 분석, 예측 모델, 스마트 관리</p>
                    </div>
                `
            },
            'guitar-video': {
                title: '기타 연주 - "Hotel California"',
                content: `
                    <div style="text-align: center;">
                        <div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; margin-bottom: 1rem;">
                            <i class="fas fa-video" style="font-size: 3rem; color: #3498db; margin-bottom: 1rem;"></i>
                            <p>여기에 추후 비디오 삽입 예정</p>
                            <p>직접 업로드된 비디오를 여기에 표시 예정</p>
                        </div>
                        <p><strong>연주곡:</strong> Hotel California - Eagles</p>
                        <p><strong>연주 시간:</strong> 6분 30초</p>
                        <p><strong>설명:</strong> 클래식 기타로 연주한 Hotel California입니다. 3개월간 연습한 결과물입니다.</p>
                    </div>
                `
            },
            'japanese-video': {
                title: '일본어 학습 기록 - 노래 연습',
                content: `
                    <div style="text-align: center;">
                        <div class="video-container" style="background: #f8f9fa; padding: 2rem; border-radius: 10px; margin-bottom: 1rem;">
                            <video 
                                controls 
                                class="responsive-video"
                                preload="metadata"
                                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='300' viewBox='0 0 500 300'%3E%3Crect width='500' height='300' fill='%23e9ecef'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666' font-family='Arial' font-size='16'%3E일본어 노래 연습 영상%3C/text%3E%3C/svg%3E">
                                <source src="${videoUrl}" type="video/mp4">
                                <source src="${videoUrl.replace('.mp4', '.webm')}" type="video/webm">
                                <p>브라우저가 비디오를 지원하지 않습니다. <a href="${videoUrl}" download>비디오 다운로드</a></p>
                            </video>
                            <div class="video-info">
                                <p><strong>일본어 노래 연습 영상</strong></p>
                                <p>일본어 발음과 억양 연습을 위한 노래 연습 과정입니다.</p>
                            </div>
                        </div>
                        <div class="project-details">
                            <p><strong>연습 곡:</strong> 일본어 팝송</p>
                            <p><strong>학습 목표:</strong> 발음과 억양 개선</p>
                            <p><strong>연습 기간:</strong> 3개월</p>
                            <p><strong>주요 내용:</strong> 일본어 발음, 억양, 리듬감 연습</p>
                        </div>
                    </div>
                `
            },
            'piano-video': {
                title: '피아노 연주 - "Rivers"',
                content: `
                    <div style="text-align: center;">
                        <div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; margin-bottom: 1rem;">
                            <i class="fas fa-music" style="font-size: 3rem; color: #3498db; margin-bottom: 1rem;"></i>
                            <p>피아노 연주 영상</p>
                            <p>직접 작곡한 곡을 연주한 영상입니다.</p>
                        </div>
                        <p><strong>연주곡:</strong> Rivers - Hanna Lee</p>
                        <p><strong>연주 시간:</strong> 2분 15초</p>
                        <p><strong>설명:</strong> 피아노 독학 1개월차에 연주한 곡입니다.</p>
                    </div>
                `
            },
            'art-video': {
                title: '미술 포트폴리오',
                content: `
                    <div style="text-align: center;">
                        <div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; margin-bottom: 1rem;">
                            <i class="fas fa-palette" style="font-size: 3rem; color: #3498db; margin-bottom: 1rem;"></i>
                            <p>미술 포트폴리오</p>
                            <p>전시회와 입시용 미술 작업물들을 담은 포트폴리오입니다.</p>
                        </div>
                        <p><strong>작품 종류:</strong> 소묘, 유화, 수채화, 디자인</p>
                        <p><strong>작업 기간:</strong> 4년</p>
                        <p><strong>설명:</strong> 패션디자인과 재학 중 제작한 다양한 미술 작품들입니다.</p>
                    </div>
                `
            }
        };
        
        const video = videoData[videoId];
        if (video) {
            modalTitle.textContent = video.title;
            modalBody.innerHTML = video.content;
            
            // 비디오 로드 완료 후 컨트롤 활성화
            const newVideo = modal.querySelector('video');
            if (newVideo) {
                newVideo.addEventListener('loadedmetadata', function() {
                    console.log('비디오 로드 완료:', videoId);
                });
                
                newVideo.addEventListener('error', function(e) {
                    console.error('비디오 로드 오류:', e);
                    const videoContainer = newVideo.closest('.video-container');
                    if (videoContainer) {
                        videoContainer.innerHTML = `
                            <div style="text-align: center; padding: 2rem; color: #666;">
                                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 1rem;"></i>
                                <p>비디오를 불러올 수 없습니다.</p>
                                <p>파일 경로를 확인해주세요.</p>
                            </div>
                        `;
                    }
                });
            }
        }
    } catch (error) {
        console.error('비디오 로드 오류:', error);
        modalTitle.textContent = '오류 발생';
        modalBody.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 1rem;"></i>
                <p>비디오를 불러오는 중 오류가 발생했습니다.</p>
                <p>잠시 후 다시 시도해주세요.</p>
            </div>
        `;
    }
}

// ========================================
// 독서감상문 표시 함수
// ========================================
function showReading(readingId) {
    const modal = document.getElementById('videoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    const readingData = {
        'reading-1': {
            title: '"미움받을 용기" 독서감상문',
            content: `
                <div style="text-align: left; line-height: 1.8;">
                    <h3 style="color: #2c3e50; margin-bottom: 1rem;">책 정보</h3>
                    <p><strong>제목:</strong> 미움받을 용기</p>
                    <p><strong>저자:</strong> 기시미 이치로, 고가 후미타케</p>
                    <p><strong>출판사:</strong> 인플루엔셜</p>
                    <p><strong>읽은 기간:</strong> 2024년 1월</p>
                    
                    <h3 style="color: #2c3e50; margin: 2rem 0 1rem 0;">주요 내용</h3>
                    <p>이 책은 아들러 심리학을 기반으로 한 철학서로, "자유롭게 살기 위한 용기"에 대해 다룹니다. 
                    과거의 경험에 얽매이지 않고, 타인의 시선을 신경 쓰지 않으며, 현재를 살아가는 방법에 대해 
                    청년과 철학자의 대화 형식으로 설명합니다.</p>
                    
                    <h3 style="color: #2c3e50; margin: 2rem 0 1rem 0;">인상 깊은 구절</h3>
                    <blockquote style="background: #f8f9fa; padding: 1rem; border-left: 4px solid #3498db; margin: 1rem 0;">
                        "과거는 존재하지 않는다. 과거는 우리가 지금 해석하는 것일 뿐이다."
                    </blockquote>
                    
                    <h3 style="color: #2c3e50; margin: 2rem 0 1rem 0;">나의 생각</h3>
                    <p>이 책을 읽으면서 가장 큰 깨달음은 "자유는 용기를 필요로 한다"는 것이었습니다. 
                    우리는 종종 타인의 시선을 두려워하고, 과거의 실패에 얽매여 현재를 제대로 살지 못합니다. 
                    하지만 진정한 자유는 과거나 타인에게서 오는 것이 아니라, 자신의 선택과 행동에서 온다는 것을 
                    이 책을 통해 배웠습니다.</p>
                    
                    <p>특히 "과제의 분리" 개념이 인상적이었습니다. 내가 할 수 있는 것과 할 수 없는 것을 
                    명확히 구분하고, 내가 통제할 수 있는 것에만 집중하는 것이 중요하다는 점이 
                    일상생활에서 실천하기 어렵지만 매우 유용한 지혜라고 생각합니다.</p>
                    
                    <h3 style="color: #2c3e50; margin: 2rem 0 1rem 0;">평점</h3>
                    <p style="font-size: 1.2rem;">⭐⭐⭐⭐⭐ (5/5)</p>
                    
                    <p style="margin-top: 2rem; font-style: italic; color: #666;">
                        이 책은 인생의 방향을 다시 생각해보게 만드는 강력한 메시지를 담고 있습니다. 
                        특히 20대 후반에서 30대 초반의 청년들에게 추천하고 싶은 책입니다.
                    </p>
                </div>
            `
        }
    };
    
    const reading = readingData[readingId];
    if (reading) {
        modalTitle.textContent = reading.title;
        modalBody.innerHTML = reading.content;
        modal.style.display = 'block';
    }
}

// ========================================
// 전역 함수들을 window 객체에 추가
// ========================================
window.playVideo = playVideo;
window.showReading = showReading;

// ========================================
// CSS 애니메이션 추가
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    .skill-progress {
        opacity: 0;
        transition: opacity 0.5s ease;
    }

    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style); 