import NavBar from '@/components/NavBar';
import Link from 'next/link';

export default function ScreenFreeSTEMActivitiesPage() {
  return (
    <>
    <NavBar/>
    <main className="min-h-screen bg-gradient-to-b from-brand-grayBg to-white pt-24 pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8 animate-fade-in">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-brand-teal hover:text-brand-tealDark transition-colors duration-200 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all articles
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12 animate-slide-in">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-4 py-2 bg-brand-teal/10 text-brand-teal rounded-full text-sm font-semibold">
              STEM Education
            </span>
            <span className="px-4 py-2 bg-brand-coral/10 text-brand-coral rounded-full text-sm font-semibold">
              Parenting Guide
            </span>
            <span className="text-gray-500 text-sm">May 5, 2024</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500 text-sm">15 min read</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-tealDark mb-6 leading-tight">
            Top 10 Screen-Free STEM Activities for Young Children
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-brand-teal to-brand-tealDark rounded-full flex items-center justify-center text-white font-bold text-lg shadow-soft">
              L
            </div>
            <div>
              <p className="font-semibold text-gray-800">Logicology Team</p>
              <p className="text-sm text-gray-500">STEM Education Experts</p>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="mb-12 rounded-3xl overflow-hidden shadow-brand animate-zoom-in">
          <img 
            src="/Images/blogimge/22.png" 
            alt="Children engaged in screen-free STEM activities" 
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-12 animate-fade-in">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              In today's digital age, it's easy for young minds to get drawn into the glow of screens. While technology has its place, many parents are seeking meaningful ways to foster critical thinking, creativity, and problem-solving skills without relying on tablets or televisions. At Logicology, we understand the desire for enriching, hands-on experiences that truly engage and educate.
            </p>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              That's why we've compiled a comprehensive guide to the best screen-free STEM (Science, Technology, Engineering, and Mathematics) activities designed specifically for young children. These activities aren't just fun - they lay foundational skills, encourage curiosity, and promote healthy development, all while sparking joy and discovery away from the digital world.
            </p>
            
            <div className="p-6 bg-gradient-to-r from-brand-teal/10 to-transparent rounded-xl">
              <p className="text-gray-700 font-semibold">
                Join us as we explore a world of imaginative play and learning that will inspire your little one to become a budding scientist, engineer, or mathematician, one delightful discovery at a time.
              </p>
            </div>
          </section>

          {/* How to Choose Section */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">How to Choose the Right Screen-Free STEM Activities</h2>

            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                Selecting the ideal STEM activities for your child involves more than just picking something fun. Consider these key factors to ensure a truly beneficial and engaging experience:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Age Appropriateness:</h4>
                  <p className="text-gray-700">
                    Activities should match your child's developmental stage, neither being too simple to bore nor too complex to frustrate. Look for activities that can grow with them or be adapted easily.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Open-Ended Play:</h4>
                  <p className="text-gray-700">
                    The best STEM activities allow for multiple solutions and paths of exploration, encouraging creativity and critical thinking rather than following strict instructions.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Safety First:</h4>
                  <p className="text-gray-700">
                    Always prioritize activities that use non-toxic materials and are free from small parts that could be choking hazards for very young children. Supervision is key.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Skill Development Focus:</h4>
                  <p className="text-gray-700">
                    Consider what specific STEM skills you want to foster - be it fine motor skills, logical reasoning, spatial awareness, or cause-and-effect understanding.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Engagement Potential:</h4>
                  <p className="text-gray-700">
                    Will the activity genuinely capture your child's attention? Does it align with their current interests? Highly engaging activities lead to deeper learning.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Material Accessibility & Affordability:</h4>
                  <p className="text-gray-700">
                    Many fantastic STEM activities can be created using common household items or affordable craft supplies, making them accessible to everyone.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Look Section */}
          <section className="mb-12 animate-fade-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Quick Look: Our Top Picks for Screen-Free STEM Activities</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                Here's a quick overview of our recommended screen-free STEM activities, perfect for sparking curiosity and learning in young children:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">1</span>
                    </div>
                    <span><strong>Building Blocks & Construction Sets</strong> - Classic tools for engineering and spatial reasoning.</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">2</span>
                    </div>
                    <span><strong>Sensory Bins & Playdough Science</strong> - Hands-on exploration of textures, properties, and basic chemistry.</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">3</span>
                    </div>
                    <span><strong>Kitchen Science Experiments</strong> - Simple, safe experiments using everyday ingredients to teach scientific principles.</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">4</span>
                    </div>
                    <span><strong>Nature Exploration & Scavenger Hunts</strong> - Outdoor adventures that connect children with biology and observation.</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">5</span>
                    </div>
                    <span><strong>DIY Marble Runs & Ramps</strong> - Introduces concepts of gravity, motion, and engineering design.</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">6</span>
                    </div>
                    <span><strong>Water Play & Boat Building</strong> - Fun with buoyancy, fluid dynamics, and problem-solving.</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">7</span>
                    </div>
                    <span><strong>Shadow Play & Light Exploration</strong> - Discovering physics through light, shadows, and optics.</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">8</span>
                    </div>
                    <span><strong>Coding Without Computers (Logic Games)</strong> - Introduces computational thinking and sequential reasoning.</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">9</span>
                    </div>
                    <span><strong>Patterning & Sorting Activities</strong> - Develops mathematical concepts like classification and sequencing.</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">10</span>
                    </div>
                    <span><strong>Simple Circuits & Snap Electronics Kits</strong> - Early introduction to electricity and engineering principles.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dive Deeper Section */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Dive Deeper: Our Top 10 Screen-Free STEM Activities</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-8">
                Let's explore each activity in more detail, highlighting what makes it a fantastic choice for young learners.
              </p>

              {/* Activity 1 */}
              <div className="mb-10 p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                <h3 className="text-2xl font-bold text-brand-tealDark mb-4">1. Building Blocks & Construction Sets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Best For:</strong> Developing fine motor skills, spatial reasoning, creativity, and foundational engineering principles.</p>
                    <p className="text-gray-700 mb-2"><strong>Key Skills Developed:</strong> Stacking, balancing, design, problem-solving, understanding cause and effect.</p>
                    <p className="text-gray-700 mb-2"><strong>Materials Needed:</strong> Wooden blocks, LEGO DUPLO, Magna-Tiles, magnetic building blocks, or recycled cardboard boxes.</p>
                  </div>
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Why You Will Love It:</strong> Blocks offer endless possibilities for open-ended play. Children can build towers, bridges, houses, or abstract sculptures, constantly experimenting with balance and structure. It's a wonderful tool for understanding basic physics.</p>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-gray-700 text-sm"><strong>Keep In Mind:</strong> Ensure sets are age-appropriate. Younger children benefit from larger, easier-to-handle blocks, while older preschoolers might enjoy more intricate sets.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="mb-10 p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                <h3 className="text-2xl font-bold text-brand-tealDark mb-4">2. Sensory Bins & Playdough Science</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Best For:</strong> Tactile exploration, early chemistry concepts (mixtures), fine motor development, and imaginative play.</p>
                    <p className="text-gray-700 mb-2"><strong>Key Skills Developed:</strong> Sensory processing, observation, measurement (scooping), mixing, cause and effect.</p>
                    <p className="text-gray-700 mb-2"><strong>Materials Needed:</strong> Large bin, dried beans/rice/pasta, scoops, small toys, measuring cups, homemade playdough, baking soda, vinegar, food coloring.</p>
                  </div>
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Why You Will Love It:</strong> Sensory bins are incredibly calming and engaging. Adding elements like baking soda and vinegar to playdough or a bin creates fizzing reactions, introducing simple chemical concepts in a safe, fun way.</p>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-gray-700 text-sm"><strong>Keep In Mind:</strong> Supervise closely, especially with very young children who might put items in their mouths. Use non-toxic ingredients for playdough.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="mb-10 p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                <h3 className="text-2xl font-bold text-brand-tealDark mb-4">3. Kitchen Science Experiments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Best For:</strong> Introducing scientific method, observation, prediction, and understanding chemical reactions with familiar materials.</p>
                    <p className="text-gray-700 mb-2"><strong>Key Skills Developed:</strong> Asking questions, experimenting, observing changes, following simple instructions.</p>
                    <p className="text-gray-700 mb-2"><strong>Materials Needed:</strong> Baking soda, vinegar, food coloring, lemon juice, milk, dish soap, oil, water, cups, spoons.</p>
                  </div>
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Why You Will Love It:</strong> These experiments are often dramatic and exciting, making scientific principles tangible. Volcanoes, dancing raisins, or color-changing milk are classics that never fail to delight and educate. For more ideas, explore simple science concepts on <a href="https://en.wikipedia.org/wiki/Science_education" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline">Wikipedia's science education page</a>.</p>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-gray-700 text-sm"><strong>Keep In Mind:</strong> Always conduct experiments with adult supervision. Emphasize safety and explain that tasting is not part of the experiment unless explicitly stated (e.g., making edible slime).</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity 4 */}
              <div className="mb-10 p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                <h3 className="text-2xl font-bold text-brand-tealDark mb-4">4. Nature Exploration & Scavenger Hunts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Best For:</strong> Connecting with the natural world, observation skills, classification, and understanding basic biology and ecology.</p>
                    <p className="text-gray-700 mb-2"><strong>Key Skills Developed:</strong> Observation, pattern recognition, classification, problem-solving (finding items), gross motor skills.</p>
                    <p className="text-gray-700 mb-2"><strong>Materials Needed:</strong> Magnifying glass, collection bag, checklist (pictures for younger children), nature guide (optional).</p>
                  </div>
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Why You Will Love It:</strong> Outdoor play is crucial for development. Nature hunts encourage children to look closely at their environment, identify different leaves, rocks, or insects, and learn about ecosystems. It's a fantastic way to introduce biology in a hands-on way.</p>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-gray-700 text-sm"><strong>Keep In Mind:</strong> Dress appropriately for the weather. Teach children to observe and respect nature without harming it. Wash hands thoroughly after outdoor exploration.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity 5 */}
              <div className="mb-10 p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                <h3 className="text-2xl font-bold text-brand-tealDark mb-4">5. DIY Marble Runs & Ramps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Best For:</strong> Understanding physics concepts like gravity, momentum, and force, as well as engineering design and problem-solving.</p>
                    <p className="text-gray-700 mb-2"><strong>Key Skills Developed:</strong> Design, construction, testing, hypothesizing, adjusting, fine motor skills.</p>
                    <p className="text-gray-700 mb-2"><strong>Materials Needed:</strong> Cardboard tubes (toilet paper, paper towel), tape, cardboard boxes, scissors, marbles or small balls.</p>
                  </div>
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Why You Will Love It:</strong> Children can design and build their own complex systems for marbles to travel through. This involves trial and error, critical thinking about angles, height, and obstacles, and immediate feedback on their engineering choices.</p>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-gray-700 text-sm"><strong>Keep In Mind:</strong> Marbles can be a choking hazard for young children. Use larger balls or supervise very closely. The construction process itself is part of the learning.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity 6 */}
              <div className="mb-10 p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                <h3 className="text-2xl font-bold text-brand-tealDark mb-4">6. Water Play & Boat Building</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Best For:</strong> Exploring concepts of buoyancy, displacement, fluid dynamics, and material properties through playful experimentation.</p>
                    <p className="text-gray-700 mb-2"><strong>Key Skills Developed:</strong> Observation, prediction, measurement (volume), design, fine motor skills, cause and effect.</p>
                    <p className="text-gray-700 mb-2"><strong>Materials Needed:</strong> Large basin or bathtub, various items for boats (foil, sponges, corks, plastic containers), water, small toys.</p>
                  </div>
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Why You Will Love It:</strong> Water play is universally appealing. Children can experiment with which materials float or sink, design simple boats, and observe how water moves. It's a natural way to introduce early physics and engineering.</p>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-gray-700 text-sm"><strong>Keep In Mind:</strong> Supervise all water play closely, even in shallow water. Protect floors if playing indoors.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity 7 */}
              <div className="mb-10 p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                <h3 className="text-2xl font-bold text-brand-tealDark mb-4">7. Shadow Play & Light Exploration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Best For:</strong> Understanding the properties of light, creating hypotheses, and exploring concepts like opacity, transparency, and angles.</p>
                    <p className="text-gray-700 mb-2"><strong>Key Skills Developed:</strong> Observation, prediction, spatial reasoning, artistic expression, understanding light sources.</p>
                    <p className="text-gray-700 mb-2"><strong>Materials Needed:</strong> Flashlight, blank wall, various objects (toys, hands, transparent items, opaque items), white sheet (optional).</p>
                  </div>
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Why You Will Love It:</strong> Simple yet magical, shadow play allows children to manipulate light and objects to create different shadows. They can explore how light travels, why some objects block light and others don't, and even create shadow puppet stories.</p>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-gray-700 text-sm"><strong>Keep In Mind:</strong> Best done in a darkened room or at dusk. Encourage open-ended questions about what they observe.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity 8 */}
              <div className="mb-10 p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                <h3 className="text-2xl font-bold text-brand-tealDark mb-4">8. Coding Without Computers (Logic Games)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Best For:</strong> Developing computational thinking, sequential reasoning, problem-solving, and algorithmic thinking without any screens.</p>
                    <p className="text-gray-700 mb-2"><strong>Key Skills Developed:</strong> Sequencing, pattern recognition, logical deduction, directional awareness, problem decomposition.</p>
                    <p className="text-gray-700 mb-2"><strong>Materials Needed:</strong> Grid mat (drawn on paper or using tape), directional arrows, toys, board games (like Rush Hour Jr., Robot Turtles).</p>
                  </div>
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Why You Will Love It:</strong> These activities teach the fundamental logic behind coding. Children can "program" a toy to move across a grid using directional cards, solve maze puzzles, or follow a sequence of actions. Many Logicology games are designed with these principles in mind.</p>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-gray-700 text-sm"><strong>Keep In Mind:</strong> Start with very simple sequences and gradually increase complexity. Make it playful and fun, focusing on the process of solving.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity 9 */}
              <div className="mb-10 p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                <h3 className="text-2xl font-bold text-brand-tealDark mb-4">9. Patterning & Sorting Activities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Best For:</strong> Building foundational mathematical skills, including classification, sequencing, seriation, and early algebraic thinking.</p>
                    <p className="text-gray-700 mb-2"><strong>Key Skills Developed:</strong> Observation, comparison, classification, prediction, fine motor skills, number sense.</p>
                    <p className="text-gray-700 mb-2"><strong>Materials Needed:</strong> Pom-poms, buttons, beads, colored blocks, leaves, pasta, sorting trays, string.</p>
                  </div>
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Why You Will Love It:</strong> These activities help children identify attributes, create patterns (AB, ABC), and sort objects by color, size, shape, or texture. It's essential for developing logical reasoning and pre-math skills.</p>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-gray-700 text-sm"><strong>Keep In Mind:</strong> Ensure small items are not choking hazards for younger children. Encourage children to explain their sorting rules or pattern logic.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity 10 */}
              <div className="mb-10 p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                <h3 className="text-2xl font-bold text-brand-tealDark mb-4">10. Simple Circuits & Snap Electronics Kits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Best For:</strong> Introducing basic electrical engineering concepts, cause and effect, and practical problem-solving in a safe environment.</p>
                    <p className="text-gray-700 mb-2"><strong>Key Skills Developed:</strong> Circuit building, understanding conductivity, problem-solving (troubleshooting), fine motor skills.</p>
                    <p className="text-gray-700 mb-2"><strong>Materials Needed:</strong> Snap Circuits kits, conductive playdough, LED lights, small batteries, battery holders, wires.</p>
                  </div>
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Why You Will Love It:</strong> These kits allow children to build working circuits that light up, make sounds, or power small motors. It provides a concrete understanding of how electricity works and encourages experimentation with different circuit designs.</p>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-gray-700 text-sm"><strong>Keep In Mind:</strong> Always use age-appropriate kits and follow safety instructions carefully. Start with very basic circuits and build complexity.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <img 
                  src="/Images/blogimge/23.png" 
                  alt="Children building with blocks" 
                  className="rounded-2xl shadow-lg max-h-64 object-contain"
                />
                <img 
                  src="/Images/blogimge/24.png" 
                  alt="Kids doing kitchen science experiments" 
                  className="rounded-2xl shadow-lg max-h-64 object-contain"
                />
              </div>
            </div>
          </section>

          {/* Best STEM Activities for Different Scenarios */}
          <section className="mb-12 animate-fade-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Best STEM Activities for Different Scenarios</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                Every day offers a new opportunity for learning. Here are some activity recommendations tailored to various situations:
              </p>

              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-4">For Rainy Days Indoors:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">•</span>
                      </div>
                      <span><strong>Kitchen Science Experiments:</strong> Perfect for a cozy day inside, these can be done with minimal mess and maximum fun.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">•</span>
                      </div>
                      <span><strong>Building Blocks & Construction Sets:</strong> Create elaborate structures or entire cities on a rainy afternoon.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">•</span>
                      </div>
                      <span><strong>Coding Without Computers (Logic Games):</strong> Engages the mind and encourages quiet, focused play.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-4">For Outdoor Exploration:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">•</span>
                      </div>
                      <span><strong>Nature Exploration & Scavenger Hunts:</strong> Take advantage of good weather to discover the wonders of your backyard or local park.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">•</span>
                      </div>
                      <span><strong>Water Play & Boat Building:</strong> An outdoor setting is ideal for splashing and experimenting with buoyancy.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-4">For Group Play (Siblings or Friends):</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">•</span>
                      </div>
                      <span><strong>Building Blocks & Construction Sets:</strong> Encourages collaboration on larger projects and sharing ideas.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">•</span>
                      </div>
                      <span><strong>DIY Marble Runs & Ramps:</strong> Children can work together to design and build a multi-part marble run.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">•</span>
                      </div>
                      <span><strong>Sensory Bins:</strong> Multiple children can explore and interact simultaneously, promoting social skills alongside sensory development.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-4">For Quiet Time & Focus:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">•</span>
                      </div>
                      <span><strong>Patterning & Sorting Activities:</strong> Calming and repetitive, these activities are excellent for developing focus.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">•</span>
                      </div>
                      <span><strong>Shadow Play & Light Exploration:</strong> A serene activity that stimulates imagination and observation.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Choosing the Right Activities */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Choosing the Right Activities for Your Child's Stage</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                Just as clothing needs to fit properly, STEM activities should align with your child's developmental stage to be most effective and enjoyable. What engages a toddler might frustrate a preschooler, and vice-versa.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-r from-brand-teal/10 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-4">Toddlers (1-3 years):</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">•</span>
                      </div>
                      <span>Focus on sensory exploration, cause and effect, and gross motor skills.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">•</span>
                      </div>
                      <span>Activities like large building blocks, simple sensory bins (safe materials only), and basic water play are ideal.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">•</span>
                      </div>
                      <span>Keep activities short and open-ended. Supervise closely.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-brand-coral/10 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-coral mb-4">Preschoolers (3-5 years):</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">•</span>
                      </div>
                      <span>Ready for more complex problem-solving, early math concepts, and basic scientific inquiry.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">•</span>
                      </div>
                      <span>Activities like elaborate block constructions, kitchen science, nature scavenger hunts, and simple coding games are highly engaging.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">•</span>
                      </div>
                      <span>Encourage them to verbalize their thoughts, make predictions, and reflect on outcomes.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-brand-gold/10 to-transparent rounded-lg border border-brand-gold/20">
                <p className="text-gray-700">
                  <strong>Always observe your child's interests and attention span.</strong> If an activity isn't clicking, it's perfectly fine to set it aside and try again another day or adapt it to better suit their current fascinations. The goal is joyful discovery, not forced learning.
                </p>
              </div>
            </div>
          </section>

          {/* Maximizing the Learning Section */}
          <section className="mb-12 animate-fade-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Maximizing the Learning from Your Activities</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                Engaging in screen-free STEM activities is a fantastic start, but how you facilitate the play can significantly enhance the learning experience. Here are tips to make these activities last longer in their educational impact:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Ask Open-Ended Questions:</h4>
                  <p className="text-gray-700">
                    Instead of telling them what to do, ask "What do you think will happen if...?" or "How could we make this work differently?" This encourages critical thinking and hypothesis formation.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Encourage Independent Exploration:</h4>
                  <p className="text-gray-700">
                    While supervision is important, allow children the freedom to experiment, make mistakes, and discover solutions on their own. Resist the urge to fix things for them.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Document Discoveries:</h4>
                  <p className="text-gray-700">
                    Take photos, draw pictures, or simply talk about what they created or learned. This helps reinforce concepts and builds a sense of accomplishment.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Rotate Materials:</h4>
                  <p className="text-gray-700">
                    Introduce new materials or variations to familiar activities. For example, add new textures to a sensory bin or introduce different types of blocks. This keeps interest fresh and expands learning.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Connect to Real-World Concepts:</h4>
                  <p className="text-gray-700">
                    Point out how the principles they discover (like gravity from a ramp or buoyancy from a boat) apply to everyday life.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Embrace the Mess:</h4>
                  <p className="text-gray-700">
                    Many of the best hands-on activities can be a bit messy. Embrace it as part of the learning process!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Your Next Step Section */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Your Next Step to Engaging Play</h2>
            
            <div className="bg-gradient-to-r from-brand-tealDark to-brand-teal rounded-2xl p-8 text-white">
              <p className="text-lg mb-6">
                Investing in screen-free STEM activities is an investment in your child's future. By providing these rich, hands-on experiences, you're nurturing their innate curiosity and equipping them with essential skills for a rapidly changing world. From building intricate structures to exploring the wonders of nature, each activity offers a unique pathway to discovery.
              </p>
              
              <p className="font-semibold text-lg">
                We hope this guide has inspired you to explore the incredible potential of screen-free learning. For more innovative and educational resources, we invite you to browse our collection of <a href="/games" className="underline hover:no-underline">Logicology games</a> and <a href="/books" className="underline hover:no-underline">Logicology books</a>, designed to complement these activities and further ignite young minds. Happy exploring!
              </p>
            </div>
          </section>

          {/* Sources */}
          <section className="mb-12 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h3 className="text-2xl font-heading font-bold text-brand-tealDark mb-6">Sources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://en.wikipedia.org/wiki/STEM_education" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    STEM Education - Wikipedia
                  </a>
                </li>
                <li>
                  <a href="https://en.wikipedia.org/wiki/Early_childhood_education" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Early Childhood Education - Wikipedia
                  </a>
                </li>
                <li>
                  <a href="https://en.wikipedia.org/wiki/Child_development" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Child Development - Wikipedia
                  </a>
                </li>
                <li>
                  <a href="https://en.wikipedia.org/wiki/Constructivism_(learning_theory)" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Constructivist Learning - Wikipedia
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* FAQ */}
          <section className="animate-fade-in">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h3 className="text-2xl font-heading font-bold text-brand-tealDark mb-6">Frequently Asked Questions (FAQ)</h3>
              
              <div className="space-y-8">
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-brand-tealDark mb-3">Q: What age are screen-free STEM activities best for?</h4>
                  <p className="text-gray-700">
                    A: Screen-free STEM activities are beneficial for children across a wide age range, typically from toddlerhood (around 1-2 years old) through elementary school. The key is to choose age-appropriate activities that match their developmental stage and interests, ensuring they are challenging but not overwhelming.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-brand-tealDark mb-3">Q: How can I make these activities more educational?</h4>
                  <p className="text-gray-700">
                    A: To maximize the educational impact, engage with your child by asking open-ended questions like "What do you think will happen next?" or "Why did that happen?" Encourage them to hypothesize, experiment, and articulate their observations. Allow for independent exploration and resist the urge to correct them immediately; learning often happens through trial and error.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-brand-tealDark mb-3">Q: Do I need expensive materials for STEM activities?</h4>
                  <p className="text-gray-700">
                    A: Absolutely not! Many of the best STEM activities can be done with common household items or inexpensive craft supplies. Think cardboard boxes, recycled containers, baking soda, vinegar, water, and natural elements found outdoors. The focus is on the process of discovery and learning, not on fancy equipment.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-brand-tealDark mb-3">Q: How often should my child engage in STEM activities?</h4>
                  <p className="text-gray-700">
                    A: Regular exposure to STEM concepts is most beneficial. Aim for a few dedicated STEM activity sessions per week, or integrate STEM thinking into everyday routines, such as cooking or gardening. Even short bursts of focused play can be highly effective in building foundational skills and fostering a love for learning.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-brand-tealDark mb-3">Q: What if my child isn't interested in a particular STEM activity?</h4>
                  <p className="text-gray-700">
                    A: It's perfectly normal for children to have varying interests. If an activity isn't capturing their attention, don't force it. Try adapting the activity to align with their current fascinations, or introduce a different type of STEM play. The goal is to make learning enjoyable, so follow their lead and try again another time or with new materials.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center animate-bounce-slow">
          <div className="mb-8">
            <h3 className="text-2xl font-heading font-bold text-brand-tealDark mb-4">
              Ready to Explore Screen-Free STEM Activities?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Discover our curated collection of educational games, puzzles, and activity kits designed to make STEM learning fun and engaging for young children.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/stem-activities" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-teal to-brand-tealDark text-white px-8 py-4 rounded-full font-semibold hover:shadow-brand transition-all duration-300 hover:scale-105 group"
            >
              <span>Browse STEM Activities</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            <Link 
              href="/games" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-coral to-pink text-white px-8 py-4 rounded-full font-semibold hover:shadow-brand transition-all duration-300 hover:scale-105 group"
            >
              <span>Explore Educational Games</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    </main>
    </>
  );
}