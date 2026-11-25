(function(window, undefined) {
    window.Asc.plugin.init = function() {
        console.log("KAOLA OFFICE Branding Plugin loaded...");

        function replaceBranding() {
            // Thay thế text
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while(node = walker.nextNode()) {
                if (node.nodeValue && node.nodeValue.includes('ONLYOFFICE')) {
                    node.nodeValue = node.nodeValue.replace(/ONLYOFFICE/g, 'KAOLA OFFICE');
                }
            }

            // Thay thế logo
            const images = document.querySelectorAll('img');
            images.forEach(function(img) {
                if (img.src.includes('logo') || img.src.includes('onlyoffice')) {
                    img.src = 'resources/img/kaola_logo.PNG';
                }
            });

            // Thay thế link đăng ký
            const links = document.querySelectorAll('a[href*="onlyoffice.com/registration.aspx"]');
            links.forEach(function(link) {
                link.href = 'https://drive.kaola.vn';
            });
        }

        // Chạy lần đầu
        replaceBranding();
        
        // Sử dụng MutationObserver để theo dõi thay đổi DOM (thay thế cho setInterval)
        const observer = new MutationObserver(function(mutations) {
            replaceBranding();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };
})(window, undefined);
