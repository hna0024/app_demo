// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";
import { getDatabase, ref as dbRef, onValue, push, set as dbSet, update as dbUpdate, remove as dbRemove, get as dbGet, child } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

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
const rtdb = getDatabase(app);

// Auth readiness promise
let authReadyResolve;
const authReady = new Promise((resolve) => { authReadyResolve = resolve; });

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
    initializeReadingCRUD();
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
                try { authReadyResolve && authReadyResolve(user); } catch (_) {}
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

    // 독서 섹션 툴바 표시/숨김
    updateReadingToolbarVisibility();
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
    // 비디오 목록 구독 해제
    if (videoUnsubscribe) { try { videoUnsubscribe(); } catch (_) {} videoUnsubscribe = null; }
    // 갤러리 구독 해제
    if (galleryUnsubscribe) { try { galleryUnsubscribe(); } catch (_) {} galleryUnsubscribe = null; }
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
// 비디오 재생 함수 (Firebase Storage 연동) - 동적 업로드/목록/삭제
// ========================================
const VIDEO_KEYS = {
	'portfolio-video': 'portfolio',
	'react-video': 'react',
	'nodejs-video': 'nodejs',
	'firebase-video': 'firebase',
	'rpa-video': 'rpa',
	'ai-video': 'ai',
	'guitar-video': 'guitar',
	'piano-video': 'piano',
	'japanese-video': 'japanese'
};

let videoUnsubscribe = null;

async function playVideo(videoId) {
    const modal = document.getElementById('videoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    // 기존 비디오 정지
    const existingVideo = modal.querySelector('video');
    if (existingVideo) {
        existingVideo.pause();
    }
    
	const key = VIDEO_KEYS[videoId];
	if (!key) {
		console.warn('알 수 없는 비디오 키:', videoId);
		return;
	}

	// 모달 UI
	modalTitle.textContent = '영상 관리';
    modalBody.innerHTML = `
		<div class="gallery-upload" style="display:flex; flex-wrap:wrap; align-items:center;">
			<input type="file" id="videoFileInput" class="file-input-hidden" accept="video/*">
			<button type="button" class="btn btn-secondary" id="videoChooseBtn">파일 선택</button>
			<input type="text" id="videoTitleInput" placeholder="영상 제목" style="flex:1; min-width:220px; padding:10px; border:2px solid #e9ecef; border-radius:8px;">
			<span class="file-name" id="videoFileName">선택된 파일 없음</span>
			<button class="btn btn-primary btn-small" id="videoUploadBtn">업로드</button>
		</div>
		<div class="video-grid" id="videoList">
			<div style="text-align:center; padding:2rem; width:100%">
            <div class="loading-spinner"></div>
				<p>영상을 불러오는 중입니다...</p>
			</div>
        </div>
    `;
    modal.style.display = 'block';
    
	// 파일 선택/업로드 핸들러
	const chooseBtn = document.getElementById('videoChooseBtn');
	const fileInput = document.getElementById('videoFileInput');
	const fileName = document.getElementById('videoFileName');
	const uploadBtn = document.getElementById('videoUploadBtn');
	const titleInput = document.getElementById('videoTitleInput');
	if (chooseBtn) chooseBtn.addEventListener('click', () => fileInput.click());
	fileInput.addEventListener('change', () => {
		fileName.textContent = fileInput.files && fileInput.files[0] ? fileInput.files[0].name : '선택된 파일 없음';
	});
	uploadBtn.addEventListener('click', async () => {
		const file = fileInput.files && fileInput.files[0];
		if (!file) { showNotification('업로드할 영상을 선택해주세요.', 'error'); return; }
		try {
			await authReady; // ensure authenticated before write
			const safeTitle = titleInput.value.trim() || file.name;
			const storagePath = `videos/${key}/${Date.now()}_${file.name}`;
			const sref = ref(storage, storagePath);
			await uploadBytes(sref, file);
			const itemRef = push(dbRef(rtdb, `videos/${key}`));
			await dbSet(itemRef, {
				title: safeTitle,
				storagePath: storagePath,
				createdAt: Date.now(),
				createdDate: getCurrentDateString()
			});
			showNotification('영상이 업로드되었습니다.', 'success');
			fileInput.value = '';
			titleInput.value = '';
			fileName.textContent = '선택된 파일 없음';
		} catch (e) {
			console.error('영상 업로드 오류:', e);
			showNotification('업로드 중 오류가 발생했습니다.', 'error');
		}
	});

	// 기존 구독 해제 후 새로 구독
	if (videoUnsubscribe) { try { videoUnsubscribe(); } catch (_) {} videoUnsubscribe = null; }
	videoUnsubscribe = onValue(dbRef(rtdb, `videos/${key}`), async (snap) => {
		const list = snap.val() || {};
		const arr = Object.entries(list).sort((a,b)=> (b[1].createdAt||0)-(a[1].createdAt||0));
		const items = await Promise.all(arr.map(async ([id, data]) => {
			let url = '';
			try { url = await getDownloadURL(ref(storage, data.storagePath)); } catch (e) { console.warn('URL 조회 실패:', data.storagePath, e); }
			return { id, url, title: data.title || '영상', storagePath: data.storagePath };
		}));
		renderVideoList(items, key);
	});
}

function renderVideoList(items, key) {
	const listEl = document.getElementById('videoList');
	if (!listEl) return;
	if (!items.length) {
		listEl.innerHTML = `<div style="text-align:center; color:#666; padding:2rem;">등록된 영상이 없습니다. 상단에서 업로드해 보세요.</div>`;
		return;
	}
	listEl.innerHTML = items.map(item => `
		<div class="video-item">
			<div class="video-container" style="background:#000; border-radius:10px; overflow:hidden;">
				<video controls class="responsive-video" preload="metadata">
					${item.url ? `<source src="${item.url}" type="video/mp4">` : ''}
                            </video>
                            </div>
			<div class="video-meta">
				<div class="video-title">${escapeHtml(item.title)}</div>
				<div class="video-actions">
					<button class="btn btn-secondary btn-small" data-action="delete" data-id="${item.id}" data-path="${item.storagePath}" data-key="${key}">삭제</button>
                        </div>
                        </div>
                    </div>
	`).join('');

	listEl.querySelectorAll('[data-action="delete"]').forEach(btn => {
		btn.addEventListener('click', async () => {
			const id = btn.getAttribute('data-id');
			const path = btn.getAttribute('data-path');
			const vkey = btn.getAttribute('data-key');
			if (!confirm('영상을 삭제하시겠습니까?')) return;
			try {
				await deleteObject(ref(storage, path));
				await dbRemove(dbRef(rtdb, `videos/${vkey}/${id}`));
				showNotification('삭제되었습니다.', 'success');
			} catch (e) {
				console.error('영상 삭제 오류:', e);
				showNotification('삭제 중 오류가 발생했습니다.', 'error');
			}
		});
	});
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
                    <p>이 책은 아들러 심리학을 바탕으로, “자유롭게 살기 위한 용기”가 무엇인지 풀어낸 철학 대화록이다. 
                    철학자와 청년의 대화를 통해 과거 경험의 굴레에서 벗어나, 타인의 시선이 아닌 자신의 선택으로 살아가는 방법을 제시한다.
                    핵심은 "과제의 분리"다. 내가 감당할 수 있는 것과 감당할 수 없는 것을 구분하고, 
                    내 몫에 집중할 때 비로소 진정한 자유와 평온을 얻을 수 있다는 메시지를 담고 있다.</p>
                    
                    <h3 style="color: #2c3e50; margin: 2rem 0 1rem 0;">인상 깊은 구절</h3>
                    <blockquote style="background: #f8f9fa; padding: 1rem; border-left: 4px solid #3498db; margin: 1rem 0;">
                        "과거는 존재하지 않는다. 과거는 우리가 지금 해석하는 것일 뿐이다."
                    </blockquote>
                    
                    <h3 style="color: #2c3e50; margin: 2rem 0 1rem 0;">나의 생각</h3>
                    <p>이 책을 읽으며 가장 크게 남은 울림은 "자유는 곧 용기의 다른 이름"이라는 점이었다.
                    우리는 종종 타인의 평가나 과거의 실수에 매여 현재를 충분히 살지 못한다. 
                    하지만 이 책은 그 굴레에서 벗어나는 첫걸음이 나 스스로 선택할 용기를 갖는 것임을 일깨워줬다.
                    </p>
                    
                    <p>특히 “과제의 분리” 개념은 내게 오래 남을 지혜라고 확신한다. 
                    누군가의 인정이나 반응은 내가 통제할 수 없는 영역임을 인정하고, 
                    오직 나의 태도와 행동에 집중하는 것. 
                    단순하지만 실천하기 어려운 이 원칙은 관계에서 자율성과 건강한 거리를 지켜내는 힘이 된다고 느꼈다.
                    결국 이 책은 “나를 더 선명하게 살아가는 방법”에 관한 안내서였다. 
                    과거에 얽매이지 않고, 타인의 시선에 흔들리지 않으며, 지금 이 순간 내가 나답게 서 있을 수 있는 용기. 
                    그 용기를 잃지 않는다면, 앞으로의 어떤 관계나 상황에서도 흔들리지 않는 내적 자유를 지킬 수 있으리라 확신한다.</p>
                    
                    <h3 style="color: #2c3e50; margin: 2rem 0 1rem 0;">평점</h3>
                    <p style="font-size: 1.2rem;">⭐⭐⭐⭐⭐ (5/5)</p>
                    
                    <p style="margin-top: 2rem; font-style: italic; color: #666;">
                        삶의 태도를 단순히 위로하는 차원이 아니라, 근본적인 전환을 요구하는 책이었다.
                        자신을 더 깊이 이해하고 싶거나, 인간관계에서 불필요한 무게를 내려놓고 싶은 청년들에게 꼭 권하고 싶다.
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
// 독서 섹션 CRUD (Realtime Database)
// ========================================
let readings = {};
let readingUnsubscribed = false;

function initializeReadingCRUD() {
    // 툴바 생성 (필터 바로 아래)
    const filters = document.querySelector('.project-filters');
    if (!filters || document.getElementById('readingToolbar')) return subscribeReadings();

    const toolbar = document.createElement('div');
    toolbar.id = 'readingToolbar';
    toolbar.className = 'admin-toolbar reading-toolbar';
    toolbar.style.display = 'none';
    toolbar.innerHTML = `
        <button id="readingAddBtn" class="btn btn-primary btn-small"><i class="fas fa-plus"></i> 추가</button>
    `;
    filters.insertAdjacentElement('afterend', toolbar);

    document.getElementById('readingAddBtn').addEventListener('click', function() {
        openReadingForm();
    });

    subscribeReadings();
}

function updateReadingToolbarVisibility() {
    const toolbar = document.getElementById('readingToolbar');
    if (!toolbar) return;
    toolbar.style.display = currentFilter === 'reading' ? 'flex' : 'none';
}

function subscribeReadings() {
    const readingsRef = dbRef(rtdb, 'readings');
    onValue(readingsRef, snapshot => {
        readings = snapshot.val() || {};
        renderReadingCards();
    }, error => {
        console.error('독서 데이터 구독 오류:', error);
    });
}

function renderReadingCards() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    // 기존 동적 카드 제거
    grid.querySelectorAll('.project-card.dynamic-reading').forEach(el => el.remove());

    // 데이터 → 카드 생성
    const entries = Object.entries(readings);
    const fragment = document.createDocumentFragment();
    entries.forEach(([id, data]) => {
        const card = document.createElement('div');
        card.className = 'project-card dynamic-reading';
        card.setAttribute('data-category', 'reading');
        card.setAttribute('data-reading-id', id);
        card.innerHTML = `
            <div class="project-image">
                <i class="fas fa-book"></i>
            </div>
            <div class="project-content">
                <h3>${escapeHtml(data.title || '독서감상문')}</h3>
                <p>${escapeHtml(data.description || '')}</p>
                <div class="project-tags">
                    ${(data.tags || ['독서']).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
                <button class="btn btn-small" data-action="view">감상문 보기</button>
                <div class="note-actions">
                    <button class="btn btn-secondary btn-small" data-action="edit"><i class="fas fa-edit"></i> 수정</button>
                    <button class="btn btn-secondary btn-small" data-action="delete"><i class="fas fa-trash"></i> 삭제</button>
                </div>
            </div>
        `;
        fragment.appendChild(card);
    });
    grid.appendChild(fragment);

    // 하드코딩된 기존 카드 숨기기 (reading-1 버튼 기준)
    const staticBtn = grid.querySelector("button[onclick=\"showReading('reading-1')\"]");
    if (staticBtn) {
        const staticCard = staticBtn.closest('.project-card');
        if (staticCard) staticCard.style.display = 'none';
    }

    // 이벤트 바인딩
    grid.querySelectorAll('.project-card.dynamic-reading').forEach(card => {
        const id = card.getAttribute('data-reading-id');
        const viewBtn = card.querySelector('[data-action="view"]');
        const editBtn = card.querySelector('[data-action="edit"]');
        const delBtn = card.querySelector('[data-action="delete"]');
        if (viewBtn) viewBtn.addEventListener('click', () => showReadingDynamic(id));
        if (editBtn) editBtn.addEventListener('click', () => openReadingForm(id));
        if (delBtn) delBtn.addEventListener('click', () => deleteReading(id));
    });

    // 현재 필터/페이지네이션 갱신
    filterAndPaginateProjects();
}

function openReadingForm(id) {
    const modal = document.getElementById('videoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    const item = id ? readings[id] || {} : {};

    modalTitle.textContent = id ? '독서감상문 수정' : '독서감상문 추가';
    modalBody.innerHTML = `
        <form id="readingForm">
            <div class="form-group">
                <input type="text" id="readingBookTitle" placeholder="책 제목" value="${escapeHtmlAttr(item.bookTitle || '')}" required>
            </div>
            <div class="form-group">
                <input type="text" id="readingAuthors" placeholder="저자 (쉼표로 구분)" value="${escapeHtmlAttr((item.authors || []).join(', '))}">
            </div>
            <div class="form-group">
                <input type="text" id="readingPublisher" placeholder="출판사" value="${escapeHtmlAttr(item.publisher || '')}">
            </div>
            <div class="form-group">
                <input type="text" id="readingPeriod" placeholder="읽은 기간 (예: 2024년 1월)" value="${escapeHtmlAttr(item.period || '')}">
            </div>
            <div class="form-group">
                <textarea id="readingSummary" placeholder="주요 내용" rows="5" required>${escapeHtml(item.summary || '')}</textarea>
            </div>
            <div class="form-group">
                <textarea id="readingQuote" placeholder="인상 깊은 구절" rows="3">${escapeHtml(item.quote || '')}</textarea>
            </div>
            <div class="form-group">
                <textarea id="readingThoughts" placeholder="나의 생각" rows="6" required>${escapeHtml(item.thoughts || '')}</textarea>
            </div>
            <div class="form-group">
                <input type="number" id="readingRating" placeholder="평점 (1~5)" min="1" max="5" value="${Number(item.rating || 5)}">
            </div>
            <div class="form-group">
                <textarea id="readingConclusion" placeholder="결론/추천 문구" rows="3">${escapeHtml(item.conclusion || '')}</textarea>
            </div>
            <div class="form-group">
                <input type="text" id="readingTags" placeholder="태그 (쉼표로 구분)" value="${escapeHtmlAttr((item.tags || ['독서']).join(', '))}">
            </div>
            <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
                <button type="button" class="btn btn-secondary" id="readingCancelBtn">취소</button>
                <button type="submit" class="btn btn-primary">저장</button>
            </div>
        </form>
    `;
    modal.style.display = 'block';

    const form = document.getElementById('readingForm');
    const cancelBtn = document.getElementById('readingCancelBtn');
    cancelBtn.addEventListener('click', closeModal);
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const payload = collectReadingPayload();
        try {
            if (id) {
                await dbUpdate(dbRef(rtdb, `readings/${id}`), {
                    ...payload,
                    updatedAt: Date.now(),
                });
            } else {
                const newRef = push(dbRef(rtdb, 'readings'));
                await dbSet(newRef, {
                    ...payload,
                    createdAt: Date.now(),
                    createdDate: getCurrentDateString(),
                    updatedAt: Date.now(),
                });
            }
            closeModal();
        } catch (err) {
            console.error('독서감상문 저장 오류:', err);
            showNotification('저장 중 오류가 발생했습니다.', 'error');
        }
    });
}

function collectReadingPayload() {
    const bookTitle = document.getElementById('readingBookTitle').value.trim();
    const authors = document.getElementById('readingAuthors').value.trim()
        ? document.getElementById('readingAuthors').value.split(',').map(t => t.trim()).filter(Boolean)
        : [];
    const publisher = document.getElementById('readingPublisher').value.trim();
    const period = document.getElementById('readingPeriod').value.trim();
    const summary = document.getElementById('readingSummary').value.trim();
    const quote = document.getElementById('readingQuote').value.trim();
    const thoughts = document.getElementById('readingThoughts').value.trim();
    const rating = Math.max(1, Math.min(5, Number(document.getElementById('readingRating').value || 5)));
    const conclusionInput = document.getElementById('readingConclusion').value.trim();
    const defaultConclusion = '삶의 태도를 단순히 위로하는 차원이 아니라 스스로 생각하고 실천하도록 자극하는 힘이 있는 책이다. 같은 고민을 하고 있는 이들에게 꼭 권하고 싶다.';
    const conclusion = conclusionInput || defaultConclusion;
    const tags = document.getElementById('readingTags').value.trim()
        ? document.getElementById('readingTags').value.split(',').map(t => t.trim()).filter(Boolean)
        : ['독서'];
    const title = `"${bookTitle}" 독서감상문`;
    const description = summary.slice(0, 100);
    const content = thoughts;
    return { title, description, tags, content, bookTitle, authors, publisher, period, summary, quote, thoughts, rating, conclusion };
}

async function deleteReading(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
        await dbRemove(dbRef(rtdb, `readings/${id}`));
        showNotification('삭제되었습니다.', 'success');
    } catch (err) {
        console.error('독서감상문 삭제 오류:', err);
        showNotification('삭제 중 오류가 발생했습니다.', 'error');
    }
}

async function showReadingDynamic(id) {
    const modal = document.getElementById('videoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    try {
        const snap = await dbGet(dbRef(rtdb, `readings/${id}`));
        const data = snap.val();
        if (!data) throw new Error('데이터가 없습니다.');
        modalTitle.textContent = `"${data.bookTitle || '독서'}" 독서감상문`;
        const authors = (data.authors || []).join(', ');
        const stars = renderStarsHtml(Number(data.rating || 5));
        const defaultConclusion = '삶의 태도를 단순히 위로하는 차원이 아니라 스스로 생각하고 실천하도록 자극하는 힘이 있는 책이다. 같은 고민을 하고 있는 이들에게 꼭 권하고 싶다.';
        const conclusion = data.conclusion || defaultConclusion;
        modalBody.innerHTML = `
            <div style="text-align: left; line-height: 1.8;">
                <h3 style="color: #2c3e50; margin-bottom: 1rem;">책 정보</h3>
                <p><strong>제목:</strong> ${escapeHtml(data.bookTitle || '')}</p>
                <p><strong>저자:</strong> ${escapeHtml(authors)}</p>
                <p><strong>출판사:</strong> ${escapeHtml(data.publisher || '')}</p>
                <p><strong>읽은 기간:</strong> ${escapeHtml(data.period || '')}</p>
                
                <h3 style="color: #2c3e50; margin: 2rem 0 1rem 0;">주요 내용</h3>
                <p>${escapeHtml(data.summary || '')}</p>
                
                <h3 style="color: #2c3e50; margin: 2rem 0 1rem 0;">인상 깊은 구절</h3>
                <blockquote style="background: #f8f9fa; padding: 1rem; border-left: 4px solid #3498db; margin: 1rem 0;">
                    ${escapeHtml(data.quote || '')}
                </blockquote>
                
                <h3 style="color: #2c3e50; margin: 2rem 0 1rem 0;">나의 생각</h3>
                <p>${escapeHtml((data.thoughts || '')).replace(/\n/g,'<br>')}</p>
                
                <h3 style="color: #2c3e50; margin: 2rem 0 0.5rem 0;">평점</h3>
                <p style="font-size: 1.2rem; color:#f1c40f;">${stars} <span style="color:#333;">(${Number(data.rating || 5)}/5)</span></p>

                <p style="margin-top: 1rem; font-style: italic; color: #666;">${escapeHtml(conclusion)}</p>
            </div>
        `;
        modal.style.display = 'block';
    } catch (error) {
        console.error('독서감상문 로드 오류:', error);
        showNotification('감상문을 불러오지 못했습니다.', 'error');
    }
}

function renderStarsHtml(n) {
    const count = Math.max(0, Math.min(5, Number(n || 0)));
    let stars = '';
    for (let i = 0; i < count; i++) stars += '★';
    for (let i = count; i < 5; i++) stars += '☆';
    return stars;
}

// yyyy-MM-dd 형식 날짜 문자열
function getCurrentDateString() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function escapeHtml(str) {
    const s = String(str);
    return s.replace(/[&<>\"']/g, function(m) {
        return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[m];
    });
}
function escapeHtmlAttr(str) {
    return escapeHtml(str).replace(/"/g, '&quot;');
}

// ========================================
// 이미지 갤러리 (Firebase Storage 연동 + 페이지네이션)
// ========================================
const GALLERY_TITLES = {
    portfolio: '포트폴리오 웹사이트 - 갤러리',
    react: 'React 웹 애플리케이션 - 갤러리',
    nodejs: 'Node.js 백엔드 API - 갤러리',
    firebase: 'Firebase 연동 웹앱 - 갤러리',
    rpa: 'RPA 자동화 시스템 - 갤러리',
    ai: 'AI 융합 스마트 시스템 - 갤러리',
    japanese: '일본어 학습 - 갤러리',
    piano: '피아노 연습 - 갤러리',
    guitar: '기타 연습 - 갤러리',
    art: '미술 - 개인 작업물 갤러리'
};

const galleryState = {
    currentGalleryId: null,
    storagePath: '',
    images: [],
    currentPage: 1,
    itemsPerPage: 6,
    rtdbPath: ''
};

let galleryUnsubscribe = null;

async function openGallery(galleryId) {
    const modal = document.getElementById('videoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    galleryState.currentGalleryId = galleryId;
    galleryState.storagePath = `galleries/${galleryId}/`;
    galleryState.rtdbPath = `galleries/${galleryId}`;
    galleryState.currentPage = 1;

    modalTitle.textContent = GALLERY_TITLES[galleryId] || '이미지 갤러리';
    modalBody.innerHTML = `
        <div class="gallery-upload">
            <input type="file" id="galleryFileInput" class="file-input-hidden" accept="image/*" multiple>
            <button type="button" class="btn btn-secondary" id="galleryChooseBtn">파일 선택</button>
            <span class="file-name" id="galleryFileName">선택된 파일 없음</span>
            <button class="btn btn-primary btn-small" id="galleryUploadBtn">업로드</button>
        </div>
        <div class="gallery-grid" id="galleryGrid">
            <div style="text-align: center; padding: 2rem; width:100%">
                <div class="loading-spinner"></div>
                <p>이미지를 불러오는 중입니다...</p>
            </div>
        </div>
        <div class="gallery-pagination" id="galleryPagination">
            <button class="gallery-pagination-btn" id="galleryPrevBtn" disabled>
                <i class="fas fa-chevron-left"></i> 이전
            </button>
            <div class="gallery-pagination-numbers" id="galleryPaginationNumbers"></div>
            <button class="gallery-pagination-btn" id="galleryNextBtn" disabled>
                다음 <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;

    modal.style.display = 'block';

    // 파일 선택 핸들러
    const chooseBtn = document.getElementById('galleryChooseBtn');
    const fileInput = document.getElementById('galleryFileInput');
    const fileName = document.getElementById('galleryFileName');
    if (chooseBtn) chooseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
        fileName.textContent = fileInput.files && fileInput.files.length
            ? Array.from(fileInput.files).map(f => f.name).join(', ')
            : '선택된 파일 없음';
    });

    attachGalleryUploadHandler();

    // 이전 구독 해제
    if (galleryUnsubscribe) { try { galleryUnsubscribe(); } catch (_) {} galleryUnsubscribe = null; }

    // RTDB 실시간 구독 → Storage URL 로드
    galleryUnsubscribe = onValue(dbRef(rtdb, galleryState.rtdbPath), async (snap) => {
        const data = snap.val() || {};
        const arr = Object.entries(data).sort((a,b)=> (b[1].createdAt||0) - (a[1].createdAt||0));
        const items = await Promise.all(arr.map(async ([id, item]) => {
            let url = '';
            try { url = await getDownloadURL(ref(storage, item.storagePath)); } catch (e) { console.warn('이미지 URL 실패:', item.storagePath, e); }
            return { id, url, storagePath: item.storagePath };
        }));
        galleryState.images = items;
        filterAndPaginateSkills; // no-op to silence lints if any
        filterAndPaginateGallery();
    }, (error) => {
        console.error('갤러리 RTDB 구독 오류:', error);
        // Fallback: Storage listAll
        loadGalleryFromStorageFallback();
    });
}

async function loadGalleryFromStorageFallback() {
    try {
        const listRef = ref(storage, galleryState.storagePath);
        const res = await listAll(listRef);
        const items = await Promise.all(res.items.map(async (it) => {
            const url = await getDownloadURL(it);
            return { id: '', url, storagePath: it.fullPath };
        }));
        galleryState.images = items.sort((a,b)=> (a.storagePath < b.storagePath ? 1 : -1));
        filterAndPaginateGallery();
    } catch (e) {
        console.error('갤러리 로드 오류:', e);
        const grid = document.getElementById('galleryGrid');
        grid.innerHTML = `
            <div style="text-align:center; padding:2rem; width:100%">
                <i class="fas fa-exclamation-triangle" style="font-size:3rem; color:#e74c3c; margin-bottom:1rem;"></i>
                <p>이미지를 불러올 수 없습니다.</p>
            </div>
        `;
    }
}

function filterAndPaginateGallery() {
    // 기존 filterAndPaginateSkills와 별개로 갤러리 전용 렌더
    const total = galleryState.images.length;
    const startIndex = (galleryState.currentPage - 1) * galleryState.itemsPerPage;
    const endIndex = startIndex + galleryState.itemsPerPage;
    const current = galleryState.images.slice(startIndex, endIndex);

    const grid = document.getElementById('galleryGrid');
    if (!total) {
        grid.innerHTML = `<div style="text-align:center; padding:2rem; width:100%">등록된 이미지가 없습니다. 상단에서 업로드해 보세요.</div>`;
        updateSkillPagination; // noop to avoid unused
        updateGalleryPagination(0);
        return;
    }

    grid.innerHTML = current.map(item => `
        <div class="gallery-item">
            <div class="gallery-actions">
                <button class="btn btn-secondary btn-small" data-action="delete-image" data-id="${item.id}" data-path="${item.storagePath}">삭제</button>
            </div>
            <div class="gallery-frame">
                <img src="${item.url}" alt="gallery-image" class="gallery-image" loading="lazy" />
            </div>
        </div>
    `).join('');

    bindGalleryDeleteHandlers();
    updateGalleryPagination(total);
}

function bindGalleryDeleteHandlers() {
    const grid = document.getElementById('galleryGrid');
    grid.querySelectorAll('[data-action="delete-image"]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            const path = btn.getAttribute('data-path');
            if (!confirm('이미지를 삭제하시겠습니까?')) return;
            try {
                await deleteObject(ref(storage, path));
                if (id) {
                    await dbRemove(dbRef(rtdb, `${galleryState.rtdbPath}/${id}`));
                } else {
                    // fallback 모드: RTDB에 항목이 없을 수 있음
                    console.warn('RTDB 항목 없음, Storage만 삭제 완료:', path);
                }
                showNotification('삭제되었습니다.', 'success');
            } catch (e) {
                console.error('이미지 삭제 오류:', e);
                showNotification('삭제 중 오류가 발생했습니다.', 'error');
            }
        });
    });
}

function renderGalleryPage() { /* deprecated by filterAndPaginateGallery, keep for compatibility */ }

function getTotalGalleryPages(totalItems) {
    return Math.max(1, Math.ceil(totalItems / galleryState.itemsPerPage));
}

function updateGalleryPagination(totalItems) {
    const totalPages = totalItems === 0 ? 1 : getTotalGalleryPages(totalItems);
    const prevBtn = document.getElementById('galleryPrevBtn');
    const nextBtn = document.getElementById('galleryNextBtn');
    const numbers = document.getElementById('galleryPaginationNumbers');

    prevBtn.disabled = galleryState.currentPage === 1 || totalItems === 0;
    nextBtn.disabled = galleryState.currentPage === totalPages || totalItems === 0;

    numbers.innerHTML = '';

    // 최대 5개 번호 표기 (기존 스타일과 동일한 로직)
    let startPage = Math.max(1, galleryState.currentPage - 2);
    let endPage = Math.min(totalPages, galleryState.currentPage + 2);
    if (endPage - startPage < 4) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + 4);
        } else {
            startPage = Math.max(1, endPage - 4);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = `gallery-page-number ${i === galleryState.currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', function() {
            galleryState.currentPage = i;
            filterAndPaginateGallery();
        });
        numbers.appendChild(btn);
    }

    prevBtn.onclick = function() {
        if (galleryState.currentPage > 1) {
            galleryState.currentPage--;
            filterAndPaginateGallery();
        }
    };

    nextBtn.onclick = function() {
        const totalPages = getTotalGalleryPages(totalItems);
        if (galleryState.currentPage < totalPages) {
            galleryState.currentPage++;
            filterAndPaginateGallery();
        }
    };
}

function attachGalleryUploadHandler() {
    const fileInput = document.getElementById('galleryFileInput');
    const uploadBtn = document.getElementById('galleryUploadBtn');
    const chooseBtn = document.getElementById('galleryChooseBtn');
    const fileName = document.getElementById('galleryFileName');

    if (!fileInput || !uploadBtn) return;

    if (chooseBtn) {
        chooseBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }

    fileInput.addEventListener('change', function() {
        if (!fileInput.files || fileInput.files.length === 0) {
            fileName.textContent = '선택된 파일 없음';
            return;
        }
        const names = Array.from(fileInput.files).map(f => f.name);
        fileName.textContent = names.join(', ');
    });

    uploadBtn.addEventListener('click', async function() {
        const files = fileInput.files;
        if (!files || files.length === 0) {
            showNotification('업로드할 이미지를 선택해주세요.', 'error');
            return;
        }
        try {
            await authReady;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const storagePath = `${galleryState.storagePath}${Date.now()}_${i}_${file.name}`;
                const fileRef = ref(storage, storagePath);
                await uploadBytes(fileRef, file);
                const newRef = push(dbRef(rtdb, galleryState.rtdbPath));
                await dbSet(newRef, { storagePath: storagePath, createdAt: Date.now(), createdDate: getCurrentDateString() });
            }
            showNotification('이미지 업로드 완료!', 'success');
            fileInput.value = '';
            fileName.textContent = '선택된 파일 없음';
        } catch (error) {
            console.error('이미지 업로드 오류:', error);
            showNotification('업로드 중 오류가 발생했습니다.', 'error');
        }
    });
}

// ========================================
// 전역 함수들을 window 객체에 추가
// ========================================
window.playVideo = playVideo;
window.showReading = showReading;
window.openGallery = openGallery;

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