import NavBar from '@/components/NavBar';
import Link from 'next/link';

export default function IsYourChildStrugglingWithLogicPage() {
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
              Parenting Guide
            </span>
            <span className="text-gray-500 text-sm">April 15, 2024</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500 text-sm">12 min read</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-tealDark mb-6 leading-tight">
            Is Your Child Struggling with Logic? Simple Strategies to Help
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-brand-teal to-brand-tealDark rounded-full flex items-center justify-center text-white font-bold text-lg shadow-soft">
              L
            </div>
            <div>
              <p className="font-semibold text-gray-800">Logicology Team</p>
              <p className="text-sm text-gray-500">Child Development Experts</p>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="mb-12 rounded-3xl overflow-hidden shadow-brand animate-zoom-in">
          <img 
            src="/Images/blogimge/19.png" 
            alt="Child struggling with logical thinking" 
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-12 animate-fade-in">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              You've noticed a pattern. Your child stares blankly at math problems that seem straightforward, struggles to follow multi-step instructions, or finds it hard to connect the dots in a story. This isn't just about grades; it's about a foundational skill-logical reasoning-that underpins everything from academic success to everyday problem-solving. As a parent, witnessing this struggle can be incredibly frustrating and even heartbreaking, leaving you searching for answers and effective ways to support your child. You want them to thrive, but sometimes the path to developing these crucial cognitive abilities isn't always clear.
            </p>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              At Logicology, we understand these challenges. We believe every child has the potential to develop strong logical thinking skills with the right approach and resources. This article will explore why your child might be struggling and provide you with actionable, step-by-step strategies to foster their logical reasoning, transforming frustration into confident problem-solving.
            </p>
          </section>

          {/* The Problem Section */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">The Problem-When Logic Doesn't Come Naturally</h2>

            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                It's more than just a bad grade on a test; difficulties with logical reasoning manifest in various ways, impacting your child's daily life and overall confidence. You might see them consistently having trouble figuring out "if-then" scenarios, making predictions, or understanding cause-and-effect relationships. This can make simple tasks surprisingly complex for them.
              </p>

              <p className="text-gray-700 text-lg mb-6">
                In school, this often translates to struggles in subjects requiring sequential thought, like mathematics or science, where steps must be followed in a specific order. They might find it hard to understand the overarching narrative in reading comprehension or to plan a simple project. Beyond academics, these challenges can surface in social situations too, where understanding nuanced social cues or predicting outcomes of their actions requires a degree of logical foresight.
              </p>

              <div className="p-6 bg-gradient-to-r from-brand-coral/10 to-transparent rounded-xl">
                <p className="text-gray-700 font-semibold">
                  The cumulative effect is often a dip in self-esteem. When a child consistently struggles with what seems easy to their peers, they can internalize feelings of inadequacy. This makes finding effective, supportive strategies not just helpful for their intellectual development, but essential for their emotional well-being as well.
                </p>
              </div>
            </div>
          </section>

          {/* Why This Keeps Happening Section */}
          <section className="mb-12 animate-fade-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Why This Keeps Happening-Understanding the Root Causes</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                It's easy to blame ourselves or our children when struggles arise, but the reality is that many factors contribute to difficulties with logical reasoning. Understanding these underlying reasons can empower you to provide more targeted support, free from judgment. Here are some common contributors:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Lack of Explicit Exposure:</h4>
                  <p className="text-gray-700">
                    Unlike reading or basic math, logical reasoning isn't always explicitly taught as a standalone subject in early education. Children are often expected to pick it up implicitly, which can leave those who need more direct instruction at a disadvantage.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Over-reliance on Rote Memorization:</h4>
                  <p className="text-gray-700">
                    Many educational systems prioritize memorization over conceptual understanding and critical thinking. If a child is always told "what" to think rather than "how" to think, their logical reasoning muscles may not get the necessary workout.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Developmental Differences:</h4>
                  <p className="text-gray-700">
                    Every child develops at their own pace. What comes easily to one child at a certain age might take another a bit longer. It doesn't indicate a lack of intelligence, but rather a need for tailored support at their current developmental stage.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Insufficient Working Memory:</h4>
                  <p className="text-gray-700">
                    Logical reasoning often requires holding multiple pieces of information in mind simultaneously, processing them, and drawing conclusions. If a child's working memory is underdeveloped, this process can become incredibly challenging.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Environmental Factors:</h4>
                  <p className="text-gray-700">
                    A lack of stimulating, open-ended play, opportunities for creative problem-solving, or engagement with puzzles and strategy games can hinder the natural development of logical thinking skills.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* The Short Answer Section */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">The Short Answer-Playful, Intentional Engagement is Key</h2>

            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                The good news is that logical reasoning is a skill that can be developed and strengthened over time. The most effective approach isn't more rote memorization or drilling, but rather intentional, playful engagement. By integrating fun, age-appropriate activities and a "think-aloud" approach into daily life, you can provide your child with the tools and practice they need to build robust logical thinking capabilities. It's about making the process enjoyable, consistent, and deeply integrated into their world. This shift from "learning" to "playing with logic" is what truly makes a difference.
              </p>
            </div>
          </section>

          {/* What The Solution Looks Like Section */}
          <section className="mb-12 animate-fade-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">What The Solution Looks Like In Real Life</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                Translating abstract strategies into daily actions can seem daunting, but it's simpler than you might think. Here's what fostering logical reasoning skills looks like in a real-world, supportive environment:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Engaging with Strategy Games:</h4>
                  <p className="text-gray-700">
                    Board games, card games, and even simple puzzles are powerful tools. Games like Chess, checkers, Sudoku, or even Go Fish require planning, predicting, and adapting to new information. They teach cause-and-effect in a low-stakes, fun way.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Reading Mystery Books:</h4>
                  <p className="text-gray-700">
                    Introducing children to "whodunit" stories or detective books encourages them to follow clues, infer, and connect disparate pieces of information to solve a larger puzzle.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Open-Ended Discussions:</h4>
                  <p className="text-gray-700">
                    Instead of giving direct answers, ask "why do you think that happened?" or "what do you think will happen next if we do X?" Encourage them to articulate their reasoning, even if it's flawed initially. This process helps them verbalize their thought sequences.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Breaking Down Complex Tasks:</h4>
                  <p className="text-gray-700">
                    For multi-step instructions, whether it's building a LEGO set or completing a chore, help your child break it down into smaller, manageable steps. Discuss the order of operations and why each step is necessary. This models sequential thinking.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Real-World Problem Solving:</h4>
                  <p className="text-gray-700">
                    Involve your child in everyday challenges. "We're out of milk-what do we need to do?" or "The remote isn't working-what could be the reasons, and how can we test them?" These practical scenarios build relevant logical skills.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Step By Step Section */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Step By Step-Guiding Your Child to Logical Confidence</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                Here's a step-by-step approach to help your child develop and strengthen their logical reasoning abilities:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Observe and Identify Specific Gaps:</h4>
                  <p className="text-gray-700">
                    Before jumping in, take time to observe. Is it difficulty with sequencing, pattern recognition, cause-and-effect, or problem deconstruction? Pinpointing the specific area helps you tailor your approach.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Introduce Fun, Age-Appropriate Logic Activities:</h4>
                  <p className="text-gray-700">
                    Start with simple puzzles, sorting games, or building blocks for younger children. For older kids, introduce strategy board games, riddles, or beginner coding activities. The key is engagement, not obligation.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Model Logical Thinking (Think Aloud):</h4>
                  <p className="text-gray-700">
                    When you're solving a problem-whether it's planning dinner or fixing something around the house-verbalize your thought process. "First, I need to check if..." or "If I do this, then that might happen." This provides a live demonstration of logical steps.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Encourage Questioning and Exploration:</h4>
                  <p className="text-gray-700">
                    Foster a safe environment where "why" and "how" questions are welcomed. Instead of rushing to an answer, ask "What do you think?" or "How could we figure that out?" This prompts independent thought.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Provide Scaffolding, Then Gradually Release:</h4>
                  <p className="text-gray-700">
                    Initially, you might provide more guidance, breaking down steps or offering hints. As your child gains confidence, slowly reduce your support, allowing them to take more ownership of the problem-solving process.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Celebrate Small Victories:</h4>
                  <p className="text-gray-700">
                    Acknowledge effort and progress, not just correct answers. "I love how you tried different strategies" or "You really stuck with that puzzle!" Positive reinforcement builds resilience and a growth mindset.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-teal/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-tealDark mb-2">Integrate Logic into Daily Routines:</h4>
                  <p className="text-gray-700">
                    Look for everyday opportunities. "If we leave five minutes later, will we still make it on time?" or "We need three ingredients; if we only have two, what's our plan?" Turn mundane moments into mini logic lessons.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How This Looks For Different People */}
          <section className="mb-12 animate-fade-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">How This Looks For Different People-Tailoring Your Approach</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                Logical reasoning development isn't one-size-fits-all. The strategies you employ should adapt to your child's age, interests, and developmental stage.
              </p>

              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-4">The Young Learner (Preschool/Early Elementary):</h3>
                  <p className="text-gray-700 mb-4">
                    For children aged 3-6, focus on concrete experiences. This includes sorting objects by color, size, or shape, completing simple jigsaw puzzles, playing "what doesn't belong," and following two-step instructions. Storytelling with a sequence ("first this happened, then that") is also highly effective. Consider building blocks and stacking toys that encourage spatial reasoning.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-4">The Elementary Student (Ages 7-11):</h3>
                  <p className="text-gray-700 mb-4">
                    At this stage, children can handle more complex tasks. Introduce classic board games like Chess, Checkers, or Othello, which demand strategy and foresight. Logic puzzles, riddles, and simple coding games that involve sequential commands are excellent. Involve them in planning family activities or simple budgeting, encouraging them to think through consequences.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-4">The Middle Schooler (Ages 12-14):</h3>
                  <p className="text-gray-700 mb-4">
                    Middle schoolers are ready for abstract thinking. Engage them in debates on current events, ethical dilemmas, or book discussions where they analyze character motivations. Strategy video games (with limits, of course), complex escape room puzzles, or even learning basic programming languages can significantly sharpen their logical abilities. Encourage critical analysis of information from various sources, helping them discern fact from opinion.
                  </p>
                </div>
              </div>

              {/* Images */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <img 
                  src="/Images/blogimge/20.png" 
                  alt="Young child playing with puzzles" 
                  className="rounded-2xl shadow-lg max-h-64 object-contain"
                />
                <img 
                  src="/Images/blogimge/21.png" 
                  alt="Older child playing strategy game" 
                  className="rounded-2xl shadow-lg max-h-64 object-contain"
                />
              </div>
            </div>
          </section>

          {/* What Might Still Be Holding You Back */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">What Might Still Be Holding You Back-Addressing Common Objections</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                It's natural to encounter obstacles or have reservations when trying a new approach. Let's tackle some common concerns:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-brand-coral/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-coral mb-2">"I don't have time to add more to our schedule."</h4>
                  <p className="text-gray-700">
                    You don't need dedicated, hour-long sessions. Logical reasoning can be woven into existing routines. A 10-minute game after dinner, a "think-aloud" moment during errands, or choosing a strategy game over a mindless activity can make a significant impact without adding stress.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-coral/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-coral mb-2">"My child resists anything that feels like 'learning'."</h4>
                  <p className="text-gray-700">
                    The key is to make it play. Frame activities as fun challenges or mysteries to solve, not academic exercises. If they enjoy games, emphasize the strategic element. If they love stories, choose a compelling mystery book. The shift in perspective is crucial.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-brand-coral/5 to-white rounded-lg">
                  <h4 className="font-bold text-brand-coral mb-2">"I'm not good at logic myself; how can I teach it?"</h4>
                  <p className="text-gray-700">
                    You don't need to be a logic expert. Your role is to facilitate curiosity and provide opportunities. Learning alongside your child, asking open-ended questions, and modeling a "growth mindset" ("Let's figure this out together!") is often more powerful than providing all the answers.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Common Mistakes To Avoid */}
          <section className="mb-12 animate-fade-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Common Mistakes To Avoid</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                While your intentions are good, some approaches can inadvertently hinder your child's logical development. Be mindful of these common pitfalls:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border-l-4 border-red-200">
                  <h4 className="font-bold text-red-600 mb-2">Over-pressuring the child:</h4>
                  <p className="text-gray-700">
                    Making logic activities feel like high-stakes tests can create anxiety and resistance, shutting down their natural curiosity.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border-l-4 border-red-200">
                  <h4 className="font-bold text-red-600 mb-2">Focusing only on "right answers":</h4>
                  <p className="text-gray-700">
                    The process of thinking through a problem is often more important than the solution itself. Celebrate the effort, exploration, and resilience.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border-l-4 border-red-200">
                  <h4 className="font-bold text-red-600 mb-2">Making it feel like schoolwork:</h4>
                  <p className="text-gray-700">
                    If logic exercises are too structured or resemble homework, children are likely to disengage. Keep it light, fun, and playful.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border-l-4 border-red-200">
                  <h4 className="font-bold text-red-600 mb-2">Not being consistent:</h4>
                  <p className="text-gray-700">
                    Sporadic efforts yield sporadic results. Even short, regular engagements are more effective than infrequent, long sessions.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border-l-4 border-red-200">
                  <h4 className="font-bold text-red-600 mb-2">Comparing children:</h4>
                  <p className="text-gray-700">
                    Every child develops differently. Comparing your child's logical abilities to a sibling or peer can undermine their confidence and make them feel inadequate.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border-l-4 border-red-200">
                  <h4 className="font-bold text-red-600 mb-2">Doing all the thinking for them:</h4>
                  <p className="text-gray-700">
                    Resist the urge to solve the problem or provide the answer immediately. Allow them to struggle constructively and explore solutions on their own, with your gentle guidance.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Your Implementation Checklist */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Your Implementation Checklist</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                Ready to empower your child's logical thinking? Use this checklist to guide your efforts:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Identify 1-2 specific logical reasoning areas to focus on (e.g., sequencing, cause-and-effect).</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Choose 1 new, age-appropriate logic activity or game to introduce this week.</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Schedule a dedicated "logic play" time (even 15-20 minutes) 2-3 times this week.</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Practice "thinking aloud" when solving everyday problems at least once a day.</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Ask open-ended "why" and "what if" questions during conversations or while reading.</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Look for real-world examples of logic (e.g., planning a route, assembling furniture).</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Acknowledge and praise effort and persistence, not just correct answers.</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Consider exploring Logicology's shop for tailored resources.</span>
                </div>
              </div>
            </div>
          </section>

          {/* 7 Day Plan */}
          <section className="mb-12 animate-fade-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Your 7 Day Plan to Boost Logical Reasoning</h2>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <p className="text-gray-700 text-lg mb-6">
                Here's a simple, actionable plan to kickstart your child's logical thinking journey:
              </p>

              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-3">Day 1: Observe & Identify</h3>
                  <p className="text-gray-700">
                    Spend the day simply observing. Note down specific instances where your child struggles with logical tasks. This helps you understand their current baseline.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-3">Day 2: Introduce a Simple Puzzle</h3>
                  <p className="text-gray-700">
                    Start with a low-pressure activity. For younger children, a shape sorter or a simple jigsaw puzzle. For older kids, a beginner Sudoku or a pattern-recognition challenge. Do it together and talk through your own process.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-3">Day 3: Read a "Whodunit" Story</h3>
                  <p className="text-gray-700">
                    Choose a mystery book or story. As you read, pause and ask, "Who do you think did it and why?" or "What clues have we found so far?" Encourage them to connect the dots.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-3">Day 4: Play a Strategy Game</h3>
                  <p className="text-gray-700">
                    Introduce a game like Checkers, Connect 4, or even a simple card game like "Go Fish" where players must make strategic decisions. Discuss the "if-then" scenarios: "If I move here, what might you do?"
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-3">Day 5: Tackle a Multi-Step Chore</h3>
                  <p className="text-gray-700">
                    Involve your child in a chore that requires multiple steps, like baking a cake or setting the table. Verbally break down the steps together and discuss the order: "What do we do first? Why?"
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-3">Day 6: Discuss a Problem</h3>
                  <p className="text-gray-700">
                    Use a problem from a TV show, a book, or a real-life scenario (e.g., "We're running late for X-what are our options?"). Focus on brainstorming solutions and evaluating their pros and cons.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-brand-teal/5 to-white rounded-xl">
                  <h3 className="text-xl font-bold text-brand-tealDark mb-3">Day 7: Review & Plan</h3>
                  <p className="text-gray-700">
                    Reflect on the week. What went well? What was challenging? Let your child lead the discussion. Then, together, choose one new activity or focus area for the upcoming week based on their interests and observed progress.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Empower Your Child Section */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-6">Empower Your Child's Mind with Logicology</h2>
            
            <div className="bg-gradient-to-r from-brand-tealDark to-brand-teal rounded-2xl p-8 text-white">
              <p className="text-lg mb-6">
                Watching your child struggle with logical reasoning can feel isolating, but you're not alone, and more importantly, you have the power to help them grow. By integrating playful, intentional, and age-appropriate strategies into your daily life, you can nurture their inherent capacity for critical thinking. Remember, it's about building foundational skills that will serve them across all aspects of life, fostering not just intelligence, but also confidence and resilience.
              </p>
              
              <p className="font-semibold text-lg">
                Ready to embark on this empowering journey? Explore our wide range of engaging products-from strategy games to interactive books-designed to make logical reasoning fun and accessible for every child. Let Logicology be your partner in unlocking your child's full potential.
              </p>
            </div>
          </section>

          {/* Sources */}
          <section className="mb-12 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h3 className="text-2xl font-heading font-bold text-brand-tealDark mb-6">Sources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://en.wikipedia.org/wiki/Logical_reasoning" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Logical Reasoning - Wikipedia
                  </a>
                </li>
                <li>
                  <a href="https://en.wikipedia.org/wiki/Cognitive_development" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Cognitive Development - Wikipedia
                  </a>
                </li>
                <li>
                  <a href="https://en.wikipedia.org/wiki/Problem_solving" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Problem Solving - Wikipedia
                  </a>
                </li>
                <li>
                  <a href="https://www.who.int/health-topics/child-development" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Child development - World Health Organization
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* FAQ */}
          <section className="animate-fade-in">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h3 className="text-2xl font-heading font-bold text-brand-tealDark mb-6">Frequently Asked Questions</h3>
              
              <div className="space-y-8">
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-brand-tealDark mb-3">Q1: What age should I start teaching logical reasoning?</h4>
                  <p className="text-gray-700">
                    A: Logical reasoning begins developing from a very young age. Even toddlers can engage in simple sorting activities or cause-and-effect play. Formal introduction to logic games or puzzles can start around ages 3-4, gradually increasing complexity as the child grows.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-brand-tealDark mb-3">Q2: How can I make learning logic fun for my child?</h4>
                  <p className="text-gray-700">
                    A: The key is play! Frame activities as games, puzzles, or mysteries to solve. Use relatable scenarios from daily life, incorporate their favorite characters or themes, and always prioritize enjoyment over formal instruction. The more fun it is, the more engaged they'll be.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-brand-tealDark mb-3">Q3: What if my child gets frustrated easily when trying to solve logic problems?</h4>
                  <p className="text-gray-700">
                    A: Frustration is common. Start with very simple tasks to build confidence. Break down problems into tiny steps. Offer gentle hints instead of solutions, and emphasize the effort and process over getting the "right" answer. Remind them that it's okay to make mistakes and try again.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-brand-tealDark mb-3">Q4: Are there signs that my child's struggle with logic might be due to a more serious issue?</h4>
                  <p className="text-gray-700">
                    A: While most struggles are developmental and improve with practice, persistent, significant difficulties across various cognitive areas, despite consistent intervention, might warrant consultation with a pediatrician, educational psychologist, or specialist. They can assess for specific learning differences or other developmental considerations.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="font-bold text-brand-tealDark mb-3">Q5: How long does it take to see improvement in logical reasoning skills?</h4>
                  <p className="text-gray-700">
                    A: Improvement is a gradual process, not an overnight transformation. With consistent, playful engagement, you might start noticing small improvements in weeks, with more significant gains over several months. Celebrate every small step forward to keep motivation high for both you and your child.
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
              Ready to Boost Your Child's Logical Thinking?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Discover our curated collection of logic games, puzzles, and educational resources designed to make learning fun and effective.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/logic-games" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-teal to-brand-tealDark text-white px-8 py-4 rounded-full font-semibold hover:shadow-brand transition-all duration-300 hover:scale-105 group"
            >
              <span>Explore Logic Games</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            <Link 
              href="/educational-puzzles" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-coral to-pink text-white px-8 py-4 rounded-full font-semibold hover:shadow-brand transition-all duration-300 hover:scale-105 group"
            >
              <span>Browse Educational Puzzles</span>
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