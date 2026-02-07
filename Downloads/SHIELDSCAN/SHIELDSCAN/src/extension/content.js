// ShieldScan - Content Script
(() => {
    function analyzePage() {
        const startTime = performance.now();
        const text = document.body.innerText.toLowerCase();
        
        const results = {
            darkPatterns: [],
            ethicalScore: 100
        };

        if (text.includes('limited time') || text.includes('almost gone')) {
            results.darkPatterns.push('Scarcity');
            results.ethicalScore -= 10;
        }

        const endTime = performance.now();
        console.log(`ShieldScan: Neural Audit Finished in ${Math.round(endTime - startTime)}ms`);

        chrome.runtime.sendMessage({
            type: 'SCAN_COMPLETE',
            payload: results
        });
    }

    if (document.readyState === 'complete') {
        setTimeout(analyzePage, 400);
    } else {
        window.addEventListener('load', () => setTimeout(analyzePage, 400));
    }
})();
