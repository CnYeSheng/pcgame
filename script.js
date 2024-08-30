//動畫
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const section = document.querySelector('section');
    const footer = document.querySelector('footer');
  
    if (nav && section && footer) {
      nav.style.opacity = '0';
      section.style.opacity = '0';
      footer.style.opacity = '0';
  
      if (header) {
        header.style.opacity = '1';
      }
  
      setTimeout(function() {
        if (nav && section && footer) {
          nav.style.opacity = '1';
          section.style.opacity = '1';
          footer.style.opacity = '1';
        }
      }, 500);
    }
  
    const customDetails = document.getElementById('custom-details');
    const gamesChose = document.getElementById('games-chose');
    const btns = document.querySelectorAll('.btn');
  
    if (customDetails && gamesChose && btns.length > 0) {
      customDetails.addEventListener('toggle', function() {
        if (this.open) {
          gamesChose.classList.remove('animate');
          void gamesChose.offsetWidth;
          gamesChose.classList.add('animate');
  
          btns.forEach(btn => {
            btn.classList.remove('animate');
            void btn.offsetWidth;
            btn.classList.add('animate');
          });
        }
      });
  
      btns.forEach(btn => {
        btn.addEventListener('click', function() {
          this.classList.remove('animate');
          void this.offsetWidth;
          this.classList.add('animate');
        });
      });
    }
  });

//遊戲選擇
// 在網頁加載後綁定點擊事件
window.addEventListener('load', function() {
    // 獲取所有的 info icon 元素
    const infoIcons = document.querySelectorAll('.info-icon');

    // 遍歷每個 info icon 元素，為其添加點擊事件
    infoIcons.forEach((icon, index) => {
        icon.addEventListener('click', function(e) {
            e.preventDefault(); // 防止點擊後跳轉

            // 獲取點擊的 info icon 的父級 .btn 元素
            const parentBtn = this.closest('.btn');
            if (parentBtn) {
                // 獲取父級 .btn 元素的 title 屬性值作為遊戲的標題
                const title = parentBtn.getAttribute('title');

                // 獲取點擊的 info icon 的 gamePlay 屬性值
                const gamePlay = this.getAttribute('gamePlay');

                // 獲取父級 .btn 元素的 href 屬性值作為遊戲的連結
                const gameLink = parentBtn.getAttribute('href');

                // 使用 SweetAlert 顯示遊戲玩法和開始遊玩按鈕
                Swal.fire({
                    title: `${title} 說明`,
                    html: `<p>${gamePlay}</p>`,
                    icon: 'info',
                    footer: '製作 <a href="https://wmcc.jp.eu.org">YeSheng</a>',
                    showCancelButton: true,
                    allowOutsideClick: false,
                    cancelButtonText: '返回',
                    confirmButtonText: '進入',
                    cancelButtonColor: '#d33',
                    confirmButtonColor: '#3085d6',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        // 如果點擊了「開始遊玩」按鈕，跳轉到遊戲連結
                        window.open(gameLink, '_blank');
                    }
                });
            }
        });
    });
});

//深色模式
// 在網頁載入完成後執行
window.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
  
    // 檢查瀏覽器是否有儲存深色模式設定
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
  
    // 根據儲存設定切換深色模式
    if (isDarkMode) {
      body.classList.add('dark-mode');
      darkModeToggle.textContent = '🌓';
    }
  
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        darkModeToggle.textContent = isDarkMode ? '🌓' : '🌓';
        localStorage.setItem('darkMode', isDarkMode);
      
        // 如果切換為深色模式,則在動畫結束後再更新背景色
        if (isDarkMode) {
          setTimeout(() => {
            body.style.backgroundColor = '#222';
          }, 800);
        } else {
            setTimeout(() => {
                body.style.backgroundColor = '#f8f9fa';
            }, 800);
        }
      });
  });

  //手機偵測
  function detectMobile() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const elementsToHide = document.querySelectorAll('.mobile');
    elementsToHide.forEach(el => {
      if (isMobile) {
        el.style.display = 'none';
      }
    });
  }