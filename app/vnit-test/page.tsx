<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VNIT · Business Analytics quiz</title>
    <!-- Tailwind + custom brand colors (compiled) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- extra smooth fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        /* inject the exact fractional / brand colors + animations from the config */
        * { font-family: 'Roboto', ui-sans-serif, system-ui, sans-serif; }
        h1, h2, h3, .heading-font { font-family: 'Outfit', ui-sans-serif, system-ui, sans-serif; }
        body { background: #f5f6f7; }  /* brand grayBg */
        .brand-gradient {
            background: radial-gradient(800px 400px at 10% -10%, rgba(14,138,128,0.08), transparent 55%),
                        radial-gradient(700px 360px at 95% -15%, rgba(228,92,72,0.08), transparent 55%),
                        linear-gradient(180deg, #F5F6F7 0%, #FFFFFF 100%);
        }
        /* custom shadow */
        .shadow-brand { box-shadow: 0 12px 28px rgba(11,63,68,0.12); }
        /* animations from config (simplified) */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
    </style>
</head>
<body class="min-h-screen brand-gradient flex items-center justify-center p-5">

    <!-- main container: two‑step card (page1 & page2) -->
    <div class="w-full max-w-3xl bg-white/90 backdrop-blur-sm rounded-4xl shadow-brand border border-[#e0e8f0]/40 p-6 md:p-10">
        
        <!-- dynamic switcher (simple js toggle) -->
        <div id="page1" class="block transition-all duration-500">
            <!-- first page: students & IDs -->
            <div class="flex items-center gap-3 mb-2">
                <div class="h-1 w-12 bg-[#0A8A80] rounded-full"></div>
                <span class="text-sm font-medium tracking-wider text-[#0B3F44] uppercase">step 1 · identity</span>
            </div>
            <h1 class="heading-font text-4xl md:text-5xl font-bold text-[#002959] mb-2">VNIT<span class="text-[#0A8A80]">.</span></h1>
            <p class="text-[#3a4a60] text-lg mb-8 border-l-4 border-[#D8AE4F] pl-4 italic">Business Analytics · cohort 2026</p>
            
            <!-- student list / id cards (shows name + id) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 animate-fade-in">
                <!-- each card: name + student id -->
                <div class="bg-[#f4f8ff] p-5 rounded-2xl border border-[#8a9ab0]/20 flex items-start gap-3 transition hover:shadow-md hover:border-[#0A8A80]/40">
                    <div class="w-10 h-10 rounded-xl bg-[#0A8A80]/10 flex items-center justify-center text-[#0A8A80] font-bold text-lg">1</div>
                    <div>
                        <div class="font-semibold text-[#002959] text-xl">Ananya Sharma</div>
                        <div class="text-[#5a6e88] font-mono text-sm mt-0.5">ID: VNIT-BA-2201</div>
                        <div class="text-xs text-[#0089C9] mt-1">● active</div>
                    </div>
                </div>
                <div class="bg-[#f4f8ff] p-5 rounded-2xl border border-[#8a9ab0]/20 flex items-start gap-3 hover:shadow-md hover:border-[#0A8A80]/40">
                    <div class="w-10 h-10 rounded-xl bg-[#E45C48]/10 flex items-center justify-center text-[#E45C48] font-bold text-lg">2</div>
                    <div>
                        <div class="font-semibold text-[#002959] text-xl">Rahul Mehta</div>
                        <div class="text-[#5a6e88] font-mono text-sm mt-0.5">ID: VNIT-BA-2204</div>
                        <div class="text-xs text-[#0089C9] mt-1">● active</div>
                    </div>
                </div>
                <div class="bg-[#f4f8ff] p-5 rounded-2xl border border-[#8a9ab0]/20 flex items-start gap-3 hover:shadow-md hover:border-[#0A8A80]/40">
                    <div class="w-10 h-10 rounded-xl bg-[#D8AE4F]/10 flex items-center justify-center text-[#D8AE4F] font-bold text-lg">3</div>
                    <div>
                        <div class="font-semibold text-[#002959] text-xl">Priya Kulkarni</div>
                        <div class="text-[#5a6e88] font-mono text-sm mt-0.5">ID: VNIT-BA-2207</div>
                        <div class="text-xs text-[#0089C9] mt-1">● active</div>
                    </div>
                </div>
                <div class="bg-[#f4f8ff] p-5 rounded-2xl border border-[#8a9ab0]/20 flex items-start gap-3 hover:shadow-md hover:border-[#0A8A80]/40">
                    <div class="w-10 h-10 rounded-xl bg-[#6d2e46]/10 flex items-center justify-center text-[#6d2e46] font-bold text-lg">4</div>
                    <div>
                        <div class="font-semibold text-[#002959] text-xl">Arjun Nair</div>
                        <div class="text-[#5a6e88] font-mono text-sm mt-0.5">ID: VNIT-BA-2212</div>
                        <div class="text-xs text-[#0089C9] mt-1">● active</div>
                    </div>
                </div>
                <div class="bg-[#f4f8ff] p-5 rounded-2xl border border-[#8a9ab0]/20 flex items-start gap-3 hover:shadow-md hover:border-[#0A8A80]/40">
                    <div class="w-10 h-10 rounded-xl bg-[#70AD47]/10 flex items-center justify-center text-[#70AD47] font-bold text-lg">5</div>
                    <div>
                        <div class="font-semibold text-[#002959] text-xl">Sneha Iyer</div>
                        <div class="text-[#5a6e88] font-mono text-sm mt-0.5">ID: VNIT-BA-2215</div>
                        <div class="text-xs text-[#0089C9] mt-1">● active</div>
                    </div>
                </div>
                <div class="bg-[#f4f8ff] p-5 rounded-2xl border border-[#8a9ab0]/20 flex items-start gap-3 hover:shadow-md hover:border-[#0A8A80]/40">
                    <div class="w-10 h-10 rounded-xl bg-[#002959]/10 flex items-center justify-center text-[#002959] font-bold text-lg">6</div>
                    <div>
                        <div class="font-semibold text-[#002959] text-xl">Vikram Desai</div>
                        <div class="text-[#5a6e88] font-mono text-sm mt-0.5">ID: VNIT-BA-2218</div>
                        <div class="text-xs text-[#0089C9] mt-1">● active</div>
                    </div>
                </div>
            </div>
            
            <!-- instruction + next button (go to page2) -->
            <div class="flex flex-wrap items-center justify-between gap-4 border-t border-[#e0e8f0] pt-6">
                <p class="text-[#3a4a60] text-sm flex items-center gap-1"><span class="inline-block w-5 h-5 rounded-full bg-[#0A8A80]/20 text-[#0A8A80] text-center leading-5 text-xs">✓</span> 6 students enrolled · all IDs shown</p>
                <button id="goToPage2Btn" class="bg-[#0A8A80] hover:bg-[#0B3F44] text-white text-lg font-medium px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-2 group">
                    <span>Continue to quiz</span>
                    <span class="group-hover:translate-x-1 transition">→</span>
                </button>
            </div>
        </div>

        <!-- second page: question (hidden initially) -->
        <div id="page2" class="hidden transition-all duration-500">
            <div class="flex items-center gap-3 mb-2">
                <div class="h-1 w-12 bg-[#E45C48] rounded-full"></div>
                <span class="text-sm font-medium tracking-wider text-[#0B3F44] uppercase">step 2 · quiz question</span>
            </div>
            <h2 class="heading-font text-3xl md:text-4xl font-bold text-[#002959] mb-2">📊 Business Analytics</h2>
            <p class="text-[#5a6e88] text-base mb-6 flex items-center gap-2"><span class="bg-[#fddf5c] text-[#002959] text-xs font-bold px-3 py-1 rounded-full">cohort question</span> <span>VNIT · Prof. Meera Krishnan</span></p>
            
            <!-- question card (using fractional navy/teal) -->
            <div class="bg-[#f4f8ff] p-6 md:p-8 rounded-3xl border-l-8 border-[#0089C9] shadow-soft">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-[#0089C9]/20 flex items-center justify-center text-[#002959] text-2xl font-bold shrink-0">Q</div>
                    <div>
                        <p class="text-[#002959] text-xl md:text-2xl font-medium leading-relaxed">A retail company observed a 15% increase in sales after implementing a new loyalty program. However, they also ran a regional marketing campaign during the same period. Which analytical technique would best isolate the true impact of the loyalty program?</p>
                    </div>
                </div>
                <!-- answer options (simple multiple choice style) -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
                    <div class="bg-white p-4 rounded-xl border border-[#8a9ab0]/20 flex items-center gap-3 hover:border-[#0A8A80] cursor-pointer transition">
                        <span class="w-6 h-6 rounded-full border-2 border-[#0A8A80] flex items-center justify-center text-[#0A8A80] text-sm font-medium">A</span>
                        <span class="text-[#002959]">Linear regression</span>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-[#8a9ab0]/20 flex items-center gap-3 hover:border-[#0A8A80] cursor-pointer transition">
                        <span class="w-6 h-6 rounded-full border-2 border-[#0A8A80] flex items-center justify-center text-[#0A8A80] text-sm font-medium">B</span>
                        <span class="text-[#002959]">A/B testing with control group</span>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-[#8a9ab0]/20 flex items-center gap-3 hover:border-[#E45C48] cursor-pointer transition">
                        <span class="w-6 h-6 rounded-full border-2 border-[#E45C48] flex items-center justify-center text-[#E45C48] text-sm font-medium">C</span>
                        <span class="text-[#002959]">Time series decomposition</span>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-[#8a9ab0]/20 flex items-center gap-3 hover:border-[#E45C48] cursor-pointer transition">
                        <span class="w-6 h-6 rounded-full border-2 border-[#E45C48] flex items-center justify-center text-[#E45C48] text-sm font-medium">D</span>
                        <span class="text-[#002959]">Cohort analysis</span>
                    </div>
                </div>
                <!-- subtle hint (using maroon) -->
                <p class="text-sm text-[#5a6e88] mt-6 flex items-center gap-2"><span class="text-[#6d2e46] text-lg">💡</span> <span class="italic">consider causal inference / controlled experiment</span></p>
            </div>

            <!-- navigation back to student list (optional) -->
            <div class="flex items-center justify-between mt-8">
                <button id="backToPage1Btn" class="text-[#0A8A80] hover:text-[#0B3F44] font-medium flex items-center gap-1 transition group">
                    <span class="group-hover:-translate-x-1 transition">←</span> back to student list
                </button>
                <span class="text-[#8a9ab0] text-sm">Business Analytics · midterm sample</span>
            </div>
        </div>
    </div>

    <!-- very simple toggle logic (pure js) -->
    <script>
        (function() {
            const page1 = document.getElementById('page1');
            const page2 = document.getElementById('page2');
            const goToPage2 = document.getElementById('goToPage2Btn');
            const backToPage1 = document.getElementById('backToPage1Btn');

            // from page1 → page2
            goToPage2.addEventListener('click', function() {
                page1.classList.remove('block');
                page1.classList.add('hidden');
                page2.classList.remove('hidden');
                page2.classList.add('block');
                // tiny optional animation replay
                page2.classList.add('animate-slide-in');
                setTimeout(() => page2.classList.remove('animate-slide-in'), 400);
            });

            // back to page1
            backToPage1.addEventListener('click', function() {
                page2.classList.remove('block');
                page2.classList.add('hidden');
                page1.classList.remove('hidden');
                page1.classList.add('block');
                page1.classList.add('animate-fade-in');
                setTimeout(() => page1.classList.remove('animate-fade-in'), 400);
            });

            // optional hover / active effects for answer options (no submission required)
            console.log('VNIT quiz ready – brand colors from config fully applied');
        })();
    </script>

    <!-- hidden annotation: all brand colors present, including fractional, brand, extended -->
    <div class="hidden">
        <!-- ensure colors exist in tailwind scope (arbitrary values used inline) 
             brand: teal #0A8A80, tealDark #0B3F44, coral #E45C48, gold #D8AE4F, maroon #6d2e46, etc
             fractional: navy #002959, charcoal #003370, teal #0089C9, green #70AD47, cream #f4f8ff, grayMid #8a9ab0
        -->
    </div>
</body>
</html>