import NavBar from '@/components/NavBar';
import Link from 'next/link';

export default function BoostProblemSolvingKidsPage() {
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
              Problem-Solving
            </span>
            <span className="px-4 py-2 bg-brand-coral/10 text-brand-coral rounded-full text-sm font-semibold">
              Ages 6-8
            </span>
            <span className="text-gray-500 text-sm">August 5, 2024</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500 text-sm">13 min read</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-tealDark mb-6 leading-tight">
            Fun Ways to Boost Problem-Solving Skills in Kids Aged 6-8
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-brand-teal to-brand-tealDark rounded-full flex items-center justify-center text-white font-bold text-lg shadow-soft">
              L
            </div>
            <div>
              <p className="font-semibold text-gray-800">Logicology Team</p>
              <p className="text-sm text-gray-500">Child Development Specialists</p>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="mb-12 rounded-3xl overflow-hidden shadow-brand animate-zoom-in">
          <img 
            src="/Images/blogimge/38.png" 
            alt="Child engaged in problem-solving activities" 
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-12 animate-fade-in">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Do you often find yourself stepping in to resolve every minor dispute between siblings or answering every "how do I do this?" question from your 6-8 year old? Perhaps you've witnessed your child melt down over a challenging puzzle or struggle to figure out how to share toys fairly with a friend. These moments, while common, can leave parents feeling overwhelmed and wondering how to empower their children to navigate life's little hurdles independently. It's a universal parenting challenge: fostering resilience and critical thinking without constantly providing the answers.
            </p>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              At Logicology, we understand this delicate balance. We believe that learning to solve problems isn't just about academic success; it's about building confidence, fostering creativity, and equipping children with essential life skills. The good news is, you don't need a textbook or a strict curriculum. The most effective way to cultivate these vital skills in kids aged 6-8 is through engaging, enjoyable activities that feel like play, not work. Let's explore how we can turn everyday challenges into exciting opportunities for growth.
            </p>
          </section>

          {/* The Problem Section */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">The Problem: Everyday Frustrations and Overwhelmed Parents</h2>

            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                Life with 6-8 year olds is a whirlwind of discovery, energy, and, let's be honest, occasional meltdowns. From forgotten homework items to disputes over who gets the last cookie, children at this age encounter numerous small problems daily. When they lack the tools to approach these situations independently, it often falls on parents to mediate, direct, or simply "fix" things.
              </p>

              <div className="p-6 bg-gradient-to-r from-brand-coral/10 to-transparent rounded-xl">
                <p className="text-gray-700 font-semibold">
                  This constant intervention can be draining for parents and, inadvertently, hinders a child's development of crucial problem-solving abilities. Children may become reliant on adults, struggling with independence and self-efficacy. This can manifest as increased frustration, impatience, or a reluctance to tackle new challenges because they haven't learned to trust their own capacity to figure things out. It's a cycle we all want to break for the sake of both our children's growth and our own peace of mind.
                </p>
              </div>
            </div>
          </section>

          {/* Why This Keeps Happening Section */}
          <section className="mb-12 animate-fade-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Why This Keeps Happening: Understanding the Roadblocks</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                It's easy to blame ourselves or our children when problem-solving seems like a constant uphill battle. However, several common factors often contribute to this struggle, none of which are anyone's fault.
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">The "Quick Fix" Temptation:</h4>
                  <p className="text-gray-700">
                    As parents, we often want to alleviate our children's distress immediately. Jumping in to solve their problems provides instant relief for both parties, but it bypasses the learning opportunity.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Lack of Structured Play:</h4>
                  <p className="text-gray-700">
                    In an increasingly digital world, unstructured play that naturally encourages problem-solving (like building with blocks, imaginative play, or navigating outdoor challenges) can sometimes take a backseat.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Underestimating Their Capacity:</h4>
                  <p className="text-gray-700">
                    We might assume certain problems are too complex for our 6-8 year olds, leading us to over-assist rather than guide them through the process.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Uncertainty About "How":</h4>
                  <p className="text-gray-700">
                    Many parents simply don't know the most effective and fun ways to teach problem solving kids 6-8 without making it feel like a chore.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Focus on Outcomes, Not Process:</h4>
                  <p className="text-gray-700">
                    We often praise the correct answer or a completed task, rather than the effort, strategies, and persistence applied during the problem-solving journey.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-brand-gold/10 to-transparent rounded-lg">
                <p className="text-gray-700 font-semibold">
                  Recognizing these roadblocks is the first step towards creating a supportive environment where children can truly flourish as independent thinkers.
                </p>
              </div>
            </div>
          </section>

          {/* The Short Answer Section */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">The Short Answer: Playful Guidance and Empowering Choices</h2>

            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                The most effective strategy to boost problem-solving skills in kids aged 6-8 is to integrate it seamlessly into their everyday lives through engaging play and guided exploration. It's about shifting from providing answers to asking questions, from fixing problems to facilitating their solutions, and from lecturing to learning alongside them. By offering opportunities for independent thought and celebrating effort over outcome, we empower children to develop a robust toolkit for tackling challenges big and small.
              </p>
            </div>
          </section>

          {/* What The Solution Looks Like Section */}
          <section className="mb-12 animate-fade-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">What The Solution Looks Like In Real Life: Everyday Problem-Solving Adventures</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                Imagine your child confidently figuring out how to balance a stack of blocks, strategizing the best move in a board game, or even negotiating with a sibling over toy usage with minimal parental intervention. This isn't just a dream; it's an achievable reality when you integrate problem-solving into their daily routine in a fun, natural way. The solution involves:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Engaging Games:</h4>
                  <p className="text-gray-700">
                    Board games, puzzles, and building activities become classrooms for critical thinking.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Open-Ended Questions:</h4>
                  <p className="text-gray-700">
                    Instead of "What's wrong?", try "What do you think we could do to solve this?"
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Embracing Mistakes:</h4>
                  <p className="text-gray-700">
                    Viewing errors not as failures, but as valuable steps in the learning process.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Real-World Scenarios:</h4>
                  <p className="text-gray-700">
                    Involving them in simple household dilemmas, like "How can we organize these toys so we find them easily?"
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Creative Play:</h4>
                  <p className="text-gray-700">
                    Encouraging imaginative scenarios where children invent problems and devise solutions.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-brand-teal/10 to-transparent rounded-lg">
                <p className="text-gray-700">
                  These approaches turn potential frustrations into exciting brain-stretching opportunities, making it genuinely fun to teach problem solving kids 6-8.
                </p>
              </div>
            </div>
          </section>

          {/* Step By Step Section */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Step By Step: Guiding Your Child to Become a Master Problem-Solver</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                Teaching problem-solving to kids aged 6-8 is a journey, not a destination. Here's a step-by-step guide to help you facilitate this crucial development:
              </p>

              <div className="space-y-5">
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">1. Identify the Problem Together:</h4>
                  <p className="text-gray-700">
                    When a challenge arises, resist the urge to jump in. Instead, help your child articulate what the problem is. "It sounds like you're frustrated because your tower keeps falling. Is that right?"
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">2. Brainstorm Solutions (No Bad Ideas!):</h4>
                  <p className="text-gray-700">
                    Encourage your child to think of multiple ways to solve the problem, no matter how silly they seem. Write them down or just talk through them. "What are some things we could try to make the tower stronger?"
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">3. Evaluate and Choose a Solution:</h4>
                  <p className="text-gray-700">
                    Discuss the pros and cons of each idea. "If we use the bigger blocks on the bottom, what might happen? What about if we use glue?" Guide them to select the most promising option.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">4. Put the Plan into Action:</h4>
                  <p className="text-gray-700">
                    Help them execute their chosen solution. This might involve gathering materials, trying a new approach, or attempting a different strategy in a game.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">5. Observe and Adjust:</h4>
                  <p className="text-gray-700">
                    If the first solution doesn't work, that's okay! It's an opportunity to learn. "That didn't quite work. What did we learn from that attempt? What else could we try from our ideas, or what new idea do you have?" This iterative process is key to problem-solving.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">6. Celebrate Effort and Learning:</h4>
                  <p className="text-gray-700">
                    Focus on the process, not just the outcome. Praise their persistence, their creativity, and their willingness to try. "You really kept trying even when it was hard! I love how you thought of so many different ways to build that tower."
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">7. Repeat Consistently:</h4>
                  <p className="text-gray-700">
                    The more opportunities children have to practice, the more their problem-solving muscles will grow. Integrate these steps into daily life, whether it's deciding what to wear, organizing toys, or navigating playground dynamics.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Persona Scenarios Section */}
          <section className="mb-12 animate-fade-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">How This Looks For Different People: Persona Scenarios</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                Problem-solving strategies can be adapted to suit different children and family dynamics. Here's how it might look:
              </p>

              <div className="space-y-8">
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-3">The Aspiring Engineer (Always Building and Inventing)</h3>
                  <p className="text-gray-700">
                    Mia, 7, loves building elaborate structures with LEGOs. When her latest spaceship design keeps falling apart, her parent doesn't offer to fix it. Instead, they sit down and ask, "What part of your spaceship is causing trouble? What ideas do you have to make it stronger?" They might suggest Mia sketches her ideas first or tries different base configurations. This approach leverages Mia's natural inclination towards construction to develop systematic problem-solving, teaching her to identify weak points and prototype solutions. Logicology's educational games that involve building or engineering challenges would be a perfect fit for Mia.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-3">The Social Butterfly (Navigating Friendships)</h3>
                  <p className="text-gray-700">
                    Leo, 8, often gets into squabbles with his friends over game rules during playdates. His parents help him verbalize the problem: "It sounds like you and Ben disagree on how to play tag." Then, they brainstorm solutions: "What could you say to Ben? Could you take turns deciding the rules? Could you find a different game you both like?" Leo practices these phrases, learning negotiation and compromise. This helps him develop interpersonal problem-solving skills, crucial for social harmony.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-3">The Curious Explorer (Constantly Asking "Why?")</h3>
                  <p className="text-gray-700">
                    Chloe, 6, is always asking questions about how things work. When her toy car won't move, instead of immediately showing her the battery compartment, her parent asks, "What do you think might be making it not go? What usually makes toys move?" They might suggest she checks if anything is blocking the wheels or if a switch is off. This method nurtures her natural curiosity, teaching her to systematically investigate causes and effects, and empowers her to diagnose and fix simple mechanical issues.
                  </p>
                </div>
              </div>

              {/* Images */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <img 
                  src="/Images/blogimge/39.png" 
                  alt="Child building with LEGOs" 
                  className="rounded-2xl shadow-lg max-h-64 object-contain"
                />
                <img 
                  src="/Images/blogimge/38.png" 
                  alt="Children playing together" 
                  className="rounded-2xl shadow-lg max-h-64 object-contain"
                />
              </div>
            </div>
          </section>

          {/* What Might Still Be Holding You Back Section */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">What Might Still Be Holding You Back: Addressing Common Objections</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                Even with the best intentions, parents might face internal hurdles when trying to foster problem-solving skills:
              </p>

              <div className="space-y-5">
                <div className="p-5 bg-gradient-to-r from-brand-coral/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-coral mb-2">"I don't have time for this."</h4>
                  <p className="text-gray-700">
                    Remember, problem-solving doesn't require dedicated "teaching time." It's about shifting your approach during everyday challenges—a few minutes spent guiding can save hours of future intervention.
                  </p>
                </div>
                
                <div className="p-5 bg-gradient-to-r from-brand-coral/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-coral mb-2">"My child just gets too frustrated."</h4>
                  <p className="text-gray-700">
                    Frustration is a natural part of learning. Offer emotional support ("I see you're feeling frustrated, it's okay") and break problems into smaller, manageable steps. Starting with simpler challenges can build confidence before moving to more complex ones.
                  </p>
                </div>
                
                <div className="p-5 bg-gradient-to-r from-brand-coral/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-coral mb-2">"I don't know what games or activities to use."</h4>
                  <p className="text-gray-700">
                    Look for open-ended toys like blocks, LEGOs, puzzles, art supplies, or simple board games. Outdoor play and even cooking together offer countless problem-solving opportunities. Our range of products at Logicology is specifically designed to engage young minds in critical thinking.
                  </p>
                </div>
                
                <div className="p-5 bg-gradient-to-r from-brand-coral/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-coral mb-2">"It feels unnatural to not just give them the answer."</h4>
                  <p className="text-gray-700">
                    It takes practice to reframe your responses. Start with small, low-stakes problems. The long-term benefits of fostering independence far outweigh the temporary discomfort of letting your child struggle a little.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Common Mistakes Section */}
          <section className="mb-12 animate-fade-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Common Mistakes To Avoid When Teaching Problem-Solving</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                To truly empower your child, be mindful of these pitfalls:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border-l-4 border-red-200">
                  <h4 className="font-bold text-red-600 mb-2">Solving it For Them:</h4>
                  <p className="text-gray-700">The most common mistake. Always giving the answer robs children of the chance to learn.</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border-l-4 border-red-200">
                  <h4 className="font-bold text-red-600 mb-2">Making it a Test:</h4>
                  <p className="text-gray-700">If problem-solving feels like an interrogation or a test, children will shut down. Keep it light, playful, and collaborative.</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border-l-4 border-red-200">
                  <h4 className="font-bold text-red-600 mb-2">Ignoring Feelings:</h4>
                  <p className="text-gray-700">Frustration is real. Acknowledge their emotions before diving into solutions. "I see you're upset. Let's take a deep breath."</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border-l-4 border-red-200">
                  <h4 className="font-bold text-red-600 mb-2">Demanding Perfection:</h4>
                  <p className="text-gray-700">Focus on the effort and the process, not just getting the "right" answer. Learning from mistakes is vital.</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border-l-4 border-red-200">
                  <h4 className="font-bold text-red-600 mb-2">Over-Coaching:</h4>
                  <p className="text-gray-700">Provide just enough guidance. Let them lead the thinking process; you're the facilitator, not the director.</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border-l-4 border-red-200">
                  <h4 className="font-bold text-red-600 mb-2">Not Practicing Consistently:</h4>
                  <p className="text-gray-700">Problem-solving is a skill that strengthens with regular, varied practice in different contexts.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Implementation Checklist */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Your Implementation Checklist: Getting Started Today</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span><strong>Observe First, Act Second:</strong> Before jumping in, observe your child's struggle to understand the core problem.</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span><strong>Ask Open-Ended Questions:</strong> Replace "What's wrong?" with "What do you think we could do?" or "What have you tried so far?"</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span><strong>Encourage Brainstorming:</strong> Dedicate time to thinking of multiple solutions, no matter how silly.</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span><strong>Incorporate Play-Based Learning:</strong> Prioritize puzzles, building sets, board games, and imaginative play.</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span><strong>Embrace Failure as a Learning Tool:</strong> Frame setbacks as opportunities to learn and adjust.</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span><strong>Involve Them in Real-Life Dilemmas:</strong> Let them help solve simple family problems (e.g., meal planning, organizing).</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span><strong>Praise Effort and Persistence:</strong> Celebrate their attempts, creativity, and resilience more than just the outcome.</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span><strong>Model Problem-Solving:</strong> Talk aloud when you're solving your own small problems (e.g., "Hmm, where did I put my keys? I'll retrace my steps...").</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span><strong>Visit Logicology:</strong> Explore our collection of tools and resources designed to boost cognitive skills in children.</span>
                </div>
              </div>
            </div>
          </section>

          {/* 7 Day Plan */}
          <section className="mb-12 animate-fade-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Your 7 Day Plan to Fun Problem-Solving</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                Here's a simple week-long plan to start integrating fun ways to teach problem solving kids 6-8 into your routine:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-1">Day 1: Puzzle Power.</h4>
                  <p className="text-gray-700">Dedicate 15-20 minutes to a jigsaw puzzle. Instead of showing them where pieces go, ask, "What shapes are you looking for?" or "Which pieces have a straight edge?"</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-1">Day 2: Building Challenge.</h4>
                  <p className="text-gray-700">Provide LEGOs or blocks and a simple challenge: "Build a bridge that can hold two toy cars." Let them experiment and ask, "What did you learn when it fell?"</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-1">Day 3: Kitchen Conundrum.</h4>
                  <p className="text-gray-700">Involve them in making a simple snack. "We only have half a cup of flour, but the recipe calls for one. How much more do we need?" or "How can we safely carry all these ingredients to the counter?"</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-1">Day 4: Board Game Bonanza.</h4>
                  <p className="text-gray-700">Play a strategy board game (e.g., checkers, Connect 4). Talk through moves, "If I move here, what might you do?" or "What's your plan for winning?"</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-1">Day 5: Outdoor Obstacle Course.</h4>
                  <p className="text-gray-700">Create a mini obstacle course in your yard or a park using natural elements. "How can you get over that log without touching the ground?" Encourage creative solutions.</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-1">Day 6: Imaginative Play: The Lost Toy.</h4>
                  <p className="text-gray-700">Present a scenario: "Oh no, your favorite teddy bear is lost! Where could he be? What clues could we look for?" Let them lead the "investigation."</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-1">Day 7: Creative Art Challenge.</h4>
                  <p className="text-gray-700">Give them limited materials (e.g., paper, tape, three pipe cleaners) and a prompt: "Build a house for a tiny bug." Focus on how they use the materials to solve the structural challenge.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Empower Your Child Section */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Empower Your Child, One Fun Challenge at a Time</h2>
            
            <div className="bg-gradient-to-r from-brand-tealDark to-brand-teal rounded-2xl p-8 text-white">
              <p className="text-lg mb-6">
                Fostering problem-solving skills in kids aged 6-8 doesn't require a special degree; it requires patience, curiosity, and a willingness to step back and let them explore. By transforming everyday frustrations into engaging learning experiences, you're not just teaching them to fix problems; you're teaching them resilience, creativity, and the confidence to tackle whatever life throws their way. Start today, and watch your child flourish into an independent, innovative thinker. Explore more resources and <a href="/shop" className="underline hover:no-underline">Logicology's engaging solutions</a> to support your child's cognitive development.
              </p>
            </div>
          </section>

          {/* Sources */}
          <section className="mb-12 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h3 className="text-2xl font-heading font-bold text-brand-tealDark mb-6">Sources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://en.wikipedia.org/wiki/Problem_solving" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Problem-solving - Wikipedia
                  </a>
                </li>
                <li>
                  <a href="https://en.wikipedia.org/wiki/Child_development" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Child development - Wikipedia
                  </a>
                </li>
                <li>
                  <a href="https://en.wikipedia.org/wiki/Play_(activity)" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Play (activity) - Wikipedia
                  </a>
                </li>
                <li>
                  <a href="https://en.wikipedia.org/wiki/Cognition" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Cognition - Wikipedia
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* FAQ */}
          <section className="animate-fade-in">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h3 className="text-2xl font-heading font-bold text-brand-tealDark mb-6">FAQ About Teaching Problem-Solving to Kids</h3>
              
              <div className="space-y-8">
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-brand-tealDark mb-3">Q: At what age should I start teaching problem-solving skills?</h4>
                  <p className="text-gray-700">
                    A: Problem-solving begins in infancy as children explore their environment. For ages 6-8, it's an ideal time to formally introduce and practice structured problem-solving through games, discussions, and real-life scenarios, as their cognitive abilities for logical thinking are rapidly developing.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-brand-tealDark mb-3">Q: My child gets frustrated easily. How can I encourage them without them giving up?</h4>
                  <p className="text-gray-700">
                    A: Acknowledge their feelings first ("I see this is really tough"). Then, break the problem into smaller, more manageable steps. Offer just enough guidance to get them unstuck, but let them do the thinking. Praise their persistence and effort, not just the solution. Remind them that mistakes are how we learn.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-brand-tealDark mb-3">Q: Are screen-based games good for problem-solving?</h4>
                  <p className="text-gray-700">
                    A: Some screen-based games, especially those designed for educational purposes, can certainly foster problem-solving skills like strategy, logic, and planning. However, it's crucial to balance screen time with hands-on, interactive play that develops different types of problem-solving skills, including social and physical challenges.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-brand-tealDark mb-3">Q: How can I make problem-solving fun for my child?</h4>
                  <p className="text-gray-700">
                    A: Integrate it into play! Use games, puzzles, building blocks, and imaginative scenarios. Frame challenges as "mysteries to solve" or "adventures to undertake." Let them take the lead in finding solutions and celebrate their creativity and unique approaches, making the process feel like a fun collaboration rather than a chore.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-brand-tealDark mb-3">Q: What's the best way to praise my child during problem-solving?</h4>
                  <p className="text-gray-700">
                    A: Focus on "process praise" rather than just "person praise" or "outcome praise." Instead of "You're so smart!" or "Great job finishing that!", try "I love how you tried so many different ways to figure that out!" or "Your persistence really paid off, even when it was difficult." This reinforces the value of effort and strategy.
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
              Ready to Boost Your Child's Problem-Solving Skills?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Discover our curated collection of games, puzzles, and activities designed to make problem-solving fun and engaging for kids aged 6-8.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/kids-games" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-teal to-brand-tealDark text-white px-8 py-4 rounded-full font-semibold hover:shadow-brand transition-all duration-300 hover:scale-105 group"
            >
              <span>Explore Kids' Games</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-coral to-pink text-white px-8 py-4 rounded-full font-semibold hover:shadow-brand transition-all duration-300 hover:scale-105 group"
            >
              <span>Visit Our Shop</span>
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