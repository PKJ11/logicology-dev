import NavBar from "@/components/NavBar";
import Link from "next/link";

export default function ScreenFreeCodingActivitiesPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gradient-to-b from-brand-grayBg to-white pb-16 pt-24">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8 animate-fade-in">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-brand-teal transition-colors duration-200 hover:text-brand-tealDark"
            >
              <svg
                className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to all articles
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-12 animate-slide-in">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-teal/10 px-4 py-2 text-sm font-semibold text-brand-teal">
                Coding Education
              </span>
              <span className="rounded-full bg-brand-coral/10 px-4 py-2 text-sm font-semibold text-brand-coral">
                Screen-Free Learning
              </span>
              <span className="text-sm text-gray-500">April 10, 2024</span>
              <span className="text-gray-500">•</span>
              <span className="text-sm text-gray-500">12 min read</span>
            </div>

            <h1 className="mb-6 font-heading text-4xl font-bold leading-tight text-brand-tealDark md:text-5xl">
              Beyond the Screen: Engaging Screen-Free Coding Activities for Kids Offline
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-brand-teal to-brand-tealDark text-lg font-bold text-white shadow-soft">
                L
              </div>
              <div>
                <p className="font-semibold text-gray-800">Logicology Team</p>
                <p className="text-sm text-gray-500">Education Experts</p>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          <div className="mb-12 animate-zoom-in overflow-hidden rounded-3xl shadow-brand">
            <img
              src="/Images/blogimge/screen-free-coding.jpg"
              alt="Children engaged in screen-free coding activities"
              className="h-64 w-full object-cover md:h-96"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-12 animate-fade-in">
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                Are you a parent juggling the desire to give your child an edge in a tech-driven
                world with the ever-present worry of excessive screen time? You're not alone. Many
                parents find themselves caught between wanting their children to develop crucial
                computational thinking skills and the nagging concern that too much digital exposure
                isn't healthy. The idea of "coding" often conjures images of glowing screens and
                intricate keyboards, leading to the false belief that valuable STEM learning must
                come at the cost of unplugged play. But what if we told you that some of the most
                profound coding lessons happen without a single pixel? Imagine a world where your
                child is learning the fundamental logic of programming using everyday objects,
                fostering creativity, problem-solving, and critical thinking - all while happily
                disconnected from a device.
              </p>
            </section>

            {/* The Problem Section */}
            <section className="mb-12 animate-slide-in">
              <h2 className="mb-6 font-heading text-3xl font-bold text-brand-tealDark">
                The Problem: The Screen-Time Dilemma Meets STEM Education
              </h2>

              <div className="mb-8 rounded-2xl border-l-4 border-brand-coral bg-white p-8 shadow-soft">
                <p className="mb-6 text-lg text-gray-700">
                  In today's digital age, children are immersed in screens from an early age.
                  Tablets, smartphones, and computers have become ubiquitous, offering endless
                  entertainment and, ostensibly, educational content. While technology can be a
                  powerful learning tool, parents increasingly feel the pressure to monitor and
                  limit screen exposure due to concerns about eyesight, attention span, and overall
                  well-being. Yet, there's also a strong push for children to learn vital
                  21st-century skills like coding and computational thinking, often perceived as
                  inherently screen-based activities. This creates a difficult paradox: how do you
                  provide your child with essential STEM education without further contributing to
                  screen overload?
                </p>

                <p className="text-lg text-gray-700">
                  The daily reality for many families involves constant negotiation around screen
                  time. Parents often feel guilty, wishing for more engaging, hands-on alternatives
                  that don't involve a device. The challenge lies in identifying and implementing
                  effective, fun, and truly educational screen-free coding activities for kids that
                  capture their attention and genuinely teach core programming concepts without the
                  need for a computer.
                </p>
              </div>
            </section>

            {/* Why This Keeps Happening */}
            <section className="mb-12 animate-fade-in">
              <h2 className="mb-6 font-heading text-3xl font-bold text-brand-tealDark">
                Why This Keeps Happening: Misconceptions and Modern Challenges
              </h2>

              <div className="rounded-2xl bg-white p-8 shadow-soft">
                <p className="mb-8 text-lg text-gray-700">
                  The struggle to balance screen time with educational opportunities often stems
                  from several common challenges and misconceptions:
                </p>

                <div className="space-y-6">
                  <div className="rounded-xl bg-gradient-to-r from-brand-teal/5 to-white p-6">
                    <h4 className="mb-2 font-bold text-brand-tealDark">
                      The "Coding = Computer" Mindset
                    </h4>
                    <p className="text-gray-700">
                      Many believe that coding is exclusively done on a computer, making it hard to
                      imagine how it could be taught offline. The truth is, coding is fundamentally
                      about logical thinking and problem-solving, which can be taught through
                      various unplugged methods.
                    </p>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-brand-teal/5 to-white p-6">
                    <h4 className="mb-2 font-bold text-brand-tealDark">
                      Lack of Awareness of Alternatives
                    </h4>
                    <p className="text-gray-700">
                      Parents are often unaware of the wealth of screen-free coding activities for
                      kids available, or how to adapt everyday items into powerful learning tools.
                    </p>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-brand-teal/5 to-white p-6">
                    <h4 className="mb-2 font-bold text-brand-tealDark">
                      Busy Schedules and Planning Fatigue
                    </h4>
                    <p className="text-gray-700">
                      Modern life is hectic. Finding the time and energy to research, plan, and
                      execute complex offline educational activities can feel overwhelming compared
                      to simply handing over a tablet.
                    </p>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-brand-teal/5 to-white p-6">
                    <h4 className="mb-2 font-bold text-brand-tealDark">
                      Fear of Not Being "Techy" Enough
                    </h4>
                    <p className="text-gray-700">
                      Some parents worry they don't understand coding themselves, and therefore
                      can't effectively teach it to their children. However, screen-free activities
                      often focus on concepts rather than syntax, making them accessible to
                      everyone.
                    </p>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-brand-teal/5 to-white p-6">
                    <h4 className="mb-2 font-bold text-brand-tealDark">
                      Perceived Lack of Engagement
                    </h4>
                    <p className="text-gray-700">
                      Children are highly stimulated by screens. Parents worry that unplugged
                      activities won't be as engaging or "fun" as digital games, making them
                      hesitant to introduce alternatives.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* The Short Answer */}
            <section className="mb-12 animate-slide-in">
              <h2 className="mb-6 font-heading text-3xl font-bold text-brand-tealDark">
                The Short Answer: Unplugged Power Play
              </h2>

              <div className="rounded-2xl bg-gradient-to-r from-brand-tealDark to-brand-teal p-8 text-white">
                <p className="mb-6 text-lg">
                  The good news is that teaching core coding principles doesn't require a screen.
                  Screen-free coding activities for kids leverage tangible play, physical movement,
                  and creative problem-solving to introduce concepts like algorithms, sequencing,
                  loops, conditionals, and debugging. By using everyday objects, board games, and
                  imaginative scenarios, children learn computational thinking in a deeply engaging,
                  hands-on way that enhances critical skills without contributing to digital
                  fatigue. It's about demystifying coding by showing its real-world applications and
                  foundations.
                </p>
              </div>
            </section>

            {/* What The Solution Looks Like In Real Life */}
            <section className="mb-12 animate-fade-in">
              <h2 className="mb-6 font-heading text-3xl font-bold text-brand-tealDark">
                What The Solution Looks Like In Real Life: Hands-On Logic and Play
              </h2>

              <div className="rounded-2xl bg-white p-8 shadow-soft">
                <p className="mb-6 text-lg text-gray-700">
                  Imagine your child directing a "robot" (you!) through a maze using only verbal
                  instructions like "take three steps forward," "turn left," or "pick up the blue
                  block." Or perhaps they're using colorful cards to sequence the steps for baking
                  cookies, understanding the precise order needed for a successful outcome. In
                  another scenario, they might be designing a treasure hunt, meticulously mapping
                  out a series of clues and actions for a friend to follow. These are all examples
                  of screen-free coding activities for kids in action.
                </p>

                <p className="text-lg text-gray-700">
                  The solution involves using readily available materials - building blocks, paper,
                  crayons, board games, even just their own bodies - to create scenarios where
                  children must think logically, break down problems, and develop step-by-step
                  instructions. They learn through play, experimentation, and collaboration,
                  building a robust foundation in computational thinking that transcends any
                  specific programming language or device. This approach fosters not just coding
                  skills but also patience, perseverance, and creative expression.
                </p>
              </div>
            </section>

            {/* Step By Step Guide */}
            <section className="mb-12 animate-slide-in">
              <h2 className="mb-6 font-heading text-3xl font-bold text-brand-tealDark">
                Step By Step: Guiding Your Child Towards Unplugged Coding Mastery
              </h2>

              <div className="rounded-2xl bg-white p-8 shadow-soft">
                <p className="mb-8 text-lg text-gray-700">
                  Transitioning to screen-free coding activities for kids is easier than you think.
                  Here's a step-by-step guide:
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal">
                      <span className="font-bold text-white">1</span>
                    </div>
                    <div>
                      <h3 className="mb-2 font-bold text-brand-tealDark">
                        Understand the Core Concepts
                      </h3>
                      <p className="text-gray-700">
                        Familiarize yourself with basic coding concepts like algorithms (a set of
                        instructions), sequencing (order of instructions), loops (repeating
                        instructions), and conditionals (if/then statements). These are the building
                        blocks you'll teach.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal">
                      <span className="font-bold text-white">2</span>
                    </div>
                    <div>
                      <h3 className="mb-2 font-bold text-brand-tealDark">
                        Gather Simple Materials
                      </h3>
                      <p className="text-gray-700">
                        You don't need fancy gadgets. Think craft supplies, LEGOs, toy cars,
                        building blocks, chalk, paper, and crayons. Many activities require nothing
                        more than imagination.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal">
                      <span className="font-bold text-white">3</span>
                    </div>
                    <div>
                      <h3 className="mb-2 font-bold text-brand-tealDark">
                        Introduce Unplugged Coding Games
                      </h3>
                      <p className="text-gray-700">
                        Start with interactive games. A classic is "Robot Says," where one person is
                        the "programmer" giving instructions (e.g., "take two steps forward, turn
                        right") to another person acting as the "robot." Emphasize clear, precise
                        instructions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal">
                      <span className="font-bold text-white">4</span>
                    </div>
                    <div>
                      <h3 className="mb-2 font-bold text-brand-tealDark">
                        Explore Coding Board and Card Games
                      </h3>
                      <p className="text-gray-700">
                        Many companies design board games specifically to teach coding logic without
                        screens. These are excellent ways to introduce complex ideas in a fun,
                        structured environment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal">
                      <span className="font-bold text-white">5</span>
                    </div>
                    <div>
                      <h3 className="mb-2 font-bold text-brand-tealDark">
                        Engage in Creative Projects with Logical Steps
                      </h3>
                      <p className="text-gray-700">
                        Challenge your child to create a recipe, design a dance routine, or plan a
                        treasure hunt. Each of these requires breaking down a goal into a sequence
                        of smaller, executable steps.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal">
                      <span className="font-bold text-white">6</span>
                    </div>
                    <div>
                      <h3 className="mb-2 font-bold text-brand-tealDark">
                        Encourage Problem-Solving and Debugging
                      </h3>
                      <p className="text-gray-700">
                        When an instruction doesn't work, encourage your child to "debug" - to find
                        the error in their logic and correct it. This is a crucial skill in real
                        coding.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal">
                      <span className="font-bold text-white">7</span>
                    </div>
                    <div>
                      <h3 className="mb-2 font-bold text-brand-tealDark">
                        Connect Concepts to Real-World Applications
                      </h3>
                      <p className="text-gray-700">
                        Point out how algorithms are used in everyday life, from traffic lights to
                        cooking instructions. This helps children see the relevance of what they're
                        learning.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal">
                      <span className="font-bold text-white">8</span>
                    </div>
                    <div>
                      <h3 className="mb-2 font-bold text-brand-tealDark">
                        Explore Resources from Logicology
                      </h3>
                      <p className="text-gray-700">
                        Visit Logicology's book collection or our games section for ideas and tools
                        specifically designed to foster logical thinking and coding principles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How This Looks For Different People */}
            <section className="mb-12 animate-fade-in">
              <h2 className="mb-6 font-heading text-3xl font-bold text-brand-tealDark">
                How This Looks For Different People: Tailored Unplugged Fun
              </h2>

              <div className="rounded-2xl bg-white p-8 shadow-soft">
                <p className="mb-8 text-lg text-gray-700">
                  Screen-free coding activities can be adapted for various ages and situations:
                </p>

                <div className="space-y-8">
                  <div className="rounded-xl border-l-4 border-brand-teal bg-gradient-to-r from-brand-teal/5 to-white p-6">
                    <h3 className="mb-3 text-xl font-bold text-brand-tealDark">
                      For Pre-K and Kindergarten (Ages 3-5)
                    </h3>
                    <p className="text-gray-700">
                      Focus on basic sequencing and patterns. Use building blocks to create towers
                      following a pattern, or draw simple mazes for a finger to trace. "Simon Says"
                      is a fantastic early game for following instructions. Use picture cards to
                      sequence the steps of a daily routine like getting ready for bed or planting a
                      seed. The goal is to develop an understanding of order and cause-and-effect.
                    </p>
                  </div>

                  <div className="rounded-xl border-l-4 border-brand-teal bg-gradient-to-r from-brand-teal/5 to-white p-6">
                    <h3 className="mb-3 text-xl font-bold text-brand-tealDark">
                      For Elementary School (Ages 6-10)
                    </h3>
                    <p className="text-gray-700">
                      Introduce more complex algorithms. Create treasure hunts with written
                      instructions, play coding board games, or try "human robot" activities where
                      children program each other's movements. They can design simple flowcharts for
                      stories or create craft projects with specific, ordered steps. This age group
                      benefits from tangible representations of logical flow and debugging
                      challenges.
                    </p>
                  </div>

                  <div className="rounded-xl border-l-4 border-brand-teal bg-gradient-to-r from-brand-teal/5 to-white p-6">
                    <h3 className="mb-3 text-xl font-bold text-brand-tealDark">
                      For Middle School (Ages 11-13)
                    </h3>
                    <p className="text-gray-700">
                      Introduce abstract concepts. Design complex logic puzzles, create rule sets
                      for new card or board games, or even delve into paper-based cryptography for
                      understanding data manipulation. They can analyze algorithms used in sports
                      plays or create detailed "how-to" guides for complex tasks, considering all
                      possible conditions. Robotic kits that are programmed physically (without a
                      screen) are also excellent at this stage. Explore products that stimulate
                      advanced thinking on our{" "}
                      <a href="/shop" className="text-brand-teal hover:underline">
                        Logicology shop page
                      </a>
                      .
                    </p>
                  </div>

                  <div className="rounded-xl border-l-4 border-brand-teal bg-gradient-to-r from-brand-teal/5 to-white p-6">
                    <h3 className="mb-3 text-xl font-bold text-brand-tealDark">
                      For Parents with Limited Tech Knowledge
                    </h3>
                    <p className="text-gray-700">
                      Don't worry about knowing programming languages. Focus on the underlying
                      logic: breaking problems into smaller parts, finding patterns, creating
                      step-by-step instructions. Many resources are designed for beginners, and the
                      beauty of unplugged coding is that it's intuitive and uses concepts you
                      already employ daily. You're teaching problem-solving, not Python syntax.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* What Might Still Be Holding You Back */}
            <section className="mb-12 animate-slide-in">
              <h2 className="mb-6 font-heading text-3xl font-bold text-brand-tealDark">
                What Might Still Be Holding You Back: Addressing Common Objections
              </h2>

              <div className="rounded-2xl bg-white p-8 shadow-soft">
                <p className="mb-8 text-lg text-gray-700">
                  It's natural to have reservations when trying something new. Here are common
                  hesitations parents face with screen-free coding activities for kids, and how to
                  overcome them:
                </p>

                <div className="space-y-6">
                  <div className="rounded-xl bg-gradient-to-r from-brand-teal/5 to-white p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-100">
                        <span className="font-bold text-yellow-500">?</span>
                      </div>
                      <div>
                        <h4 className="mb-2 font-bold text-gray-800">
                          "I'm not good at coding myself, how can I teach my child?"
                        </h4>
                        <p className="text-gray-700">
                          Remember, unplugged coding focuses on computational thinking, not actual
                          programming language syntax. You don't need to be a programmer. If you can
                          follow a recipe or give directions, you can teach the underlying logic.
                          Think of it as teaching problem-solving skills, which you already use
                          every day.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-brand-teal/5 to-white p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-100">
                        <span className="font-bold text-yellow-500">?</span>
                      </div>
                      <div>
                        <h4 className="mb-2 font-bold text-gray-800">
                          "My child prefers screens; they won't be interested in these activities."
                        </h4>
                        <p className="text-gray-700">
                          Start small and make it fun. Connect the activities to your child's
                          existing interests. If they love superheroes, create a "mission" with
                          coded instructions. If they enjoy building, use blocks to model
                          algorithms. Frame it as a game or a puzzle, not a lesson. Patience is key;
                          engagement often grows as they grasp the concepts.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-brand-teal/5 to-white p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-100">
                        <span className="font-bold text-yellow-500">?</span>
                      </div>
                      <div>
                        <h4 className="mb-2 font-bold text-gray-800">
                          "These activities seem too simple to teach 'real' coding."
                        </h4>
                        <p className="text-gray-700">
                          The "simplicity" is precisely their strength. They distill complex
                          programming concepts into understandable, tangible experiences.
                          Understanding sequencing with building blocks is the same fundamental
                          logic needed to sequence lines of code. These foundational skills are
                          crucial for later, more advanced coding. Don't underestimate the power of
                          play.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-brand-teal/5 to-white p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-100">
                        <span className="font-bold text-yellow-500">?</span>
                      </div>
                      <div>
                        <h4 className="mb-2 font-bold text-gray-800">
                          "It's too much effort to plan and organize these activities."
                        </h4>
                        <p className="text-gray-700">
                          Many screen-free coding activities for kids require minimal setup. A piece
                          of paper and a pencil can be enough for a maze game. You can find pre-made
                          printable resources online, or even adapt existing board games. Start with
                          one simple activity, and gradually expand as you and your child become
                          more comfortable. A quick visit to{" "}
                          <a href="/" className="text-brand-teal hover:underline">
                            Logicology's homepage
                          </a>{" "}
                          can provide inspiration.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Common Mistakes To Avoid */}
            <section className="mb-12 animate-fade-in">
              <h2 className="mb-6 font-heading text-3xl font-bold text-brand-tealDark">
                Common Mistakes To Avoid When Teaching Unplugged Coding
              </h2>

              <div className="rounded-2xl bg-white p-8 shadow-soft">
                <p className="mb-8 text-lg text-gray-700">
                  To make the most of your screen-free coding journey, avoid these common pitfalls:
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border-l-4 border-red-300 bg-gradient-to-r from-red-50 to-white p-4">
                    <h4 className="mb-2 font-bold text-red-600">Making it feel like schoolwork</h4>
                    <p className="text-sm text-gray-700">
                      If it feels like a chore, children will disengage. Keep it light, playful, and
                      fun.
                    </p>
                  </div>

                  <div className="rounded-lg border-l-4 border-red-300 bg-gradient-to-r from-red-50 to-white p-4">
                    <h4 className="mb-2 font-bold text-red-600">
                      Not tailoring activities to age and interest
                    </h4>
                    <p className="text-sm text-gray-700">
                      What excites a 5-year-old won't necessarily appeal to an 11-year-old. Match
                      the complexity and theme to your child.
                    </p>
                  </div>

                  <div className="rounded-lg border-l-4 border-red-300 bg-gradient-to-r from-red-50 to-white p-4">
                    <h4 className="mb-2 font-bold text-red-600">
                      Ignoring the "debugging" process
                    </h4>
                    <p className="text-sm text-gray-700">
                      When something goes wrong, don't just fix it for them. Guide them to identify
                      the error in their instructions and correct it. This is a crucial part of
                      coding.
                    </p>
                  </div>

                  <div className="rounded-lg border-l-4 border-red-300 bg-gradient-to-r from-red-50 to-white p-4">
                    <h4 className="mb-2 font-bold text-red-600">Expecting immediate mastery</h4>
                    <p className="text-sm text-gray-700">
                      Computational thinking develops over time. Celebrate small successes and
                      incremental understanding, not just perfect execution.
                    </p>
                  </div>

                  <div className="rounded-lg border-l-4 border-red-300 bg-gradient-to-r from-red-50 to-white p-4">
                    <h4 className="mb-2 font-bold text-red-600">
                      Over-complicating early activities
                    </h4>
                    <p className="text-sm text-gray-700">
                      Start with truly basic concepts before introducing more complex ones. Build a
                      strong foundation first.
                    </p>
                  </div>

                  <div className="rounded-lg border-l-4 border-red-300 bg-gradient-to-r from-red-50 to-white p-4">
                    <h4 className="mb-2 font-bold text-red-600">
                      Focusing only on the "techy" aspect
                    </h4>
                    <p className="text-sm text-gray-700">
                      Remember, you're teaching logical thought, problem-solving, and creativity,
                      not just how to "code."
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Implementation Checklist */}
            <section className="mb-12 animate-slide-in">
              <h2 className="mb-6 font-heading text-3xl font-bold text-brand-tealDark">
                Your Implementation Checklist for Screen-Free Coding Success
              </h2>

              <div className="rounded-2xl bg-white p-8 shadow-soft">
                <p className="mb-8 text-lg text-gray-700">
                  Ready to jump into screen-free coding activities for kids? Use this checklist:
                </p>

                <div className="space-y-4">
                  {[
                    "Research 2-3 age-appropriate screen-free coding activities to try first.",
                    "Gather necessary simple materials (e.g., paper, markers, blocks, playdough).",
                    "Schedule dedicated 'unplugged' time each week, even if it's just 20-30 minutes.",
                    "Start with a highly engaging game like 'Robot Says' to introduce sequencing.",
                    "Incorporate logical thinking questions into daily routines (e.g., 'What are the steps to make toast?').",
                    "Observe your child's interests and tailor future activities to those passions.",
                    "Encourage collaboration if multiple children are involved.",
                    "Celebrate every 'aha!' moment and successful 'debug.'",
                    "Explore educational resources from Logicology for more inspiration.",
                    "Consider investing in a quality coding board game or physical puzzle designed for logical thinking.",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal">
                        <span className="text-sm text-white">✓</span>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 7-Day Plan */}
            <section className="mb-12 animate-fade-in">
              <h2 className="mb-6 font-heading text-3xl font-bold text-brand-tealDark">
                Your 7-Day Plan for Introducing Screen-Free Coding
              </h2>

              <div className="rounded-2xl bg-white p-8 shadow-soft">
                <p className="mb-8 text-lg text-gray-700">
                  Here's a simple plan to kickstart your journey into screen-free coding activities
                  for kids:
                </p>

                <div className="space-y-6">
                  {[
                    {
                      day: "Day 1: 'Robot Says' Game",
                      desc: "Introduce the classic 'Robot Says' game. Take turns being the programmer and the robot. Focus on giving clear, step-by-step instructions for simple actions like walking to a specific spot or picking up a toy.",
                    },
                    {
                      day: "Day 2: Paper Maze Challenge",
                      desc: "Draw a simple maze on a large piece of paper. Have your child create a sequence of arrows (up, down, left, right) that directs a small toy car or their finger from the start to the finish. Introduce obstacles and debugging.",
                    },
                    {
                      day: "Day 3: Story Sequencing with Pictures",
                      desc: "Find 3-5 picture cards that tell a simple story (e.g., baking a cake, planting a flower). Have your child arrange them in the correct chronological order and explain their logic.",
                    },
                    {
                      day: "Day 4: Logic Board Game Play",
                      desc: "Play a board game that emphasizes strategic thinking, patterns, or movement rules (e.g., chess, checkers, or a dedicated coding board game). Discuss the 'rules' (algorithms) of the game.",
                    },
                    {
                      day: "Day 5: Treasure Hunt Design",
                      desc: "Have your child design a mini-treasure hunt for you or a sibling. They must write or draw clear instructions and clues, creating a sequence of steps to find a hidden item.",
                    },
                    {
                      day: "Day 6: Crafting with Conditionals",
                      desc: "Engage in a simple craft project (e.g., making a paper airplane, building with LEGOs). Guide them to describe the steps using 'if/then' language: 'IF the piece is red, THEN attach it here.'",
                    },
                    {
                      day: "Day 7: Reflect and Expand",
                      desc: "Discuss what they enjoyed most. Revisit any of Logicology's resources, like our product page, to find new screen-free games or activities that align with their interests. Plan your next week's activity based on their feedback.",
                    },
                  ].map((plan, index) => (
                    <div
                      key={index}
                      className="rounded-xl bg-gradient-to-r from-brand-teal/5 to-white p-6"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal font-bold text-white">
                          {index + 1}
                        </div>
                        <h3 className="font-bold text-brand-tealDark">{plan.day}</h3>
                      </div>
                      <p className="text-gray-700">{plan.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Unlock Your Child's Potential */}
            <section className="mb-12 animate-fade-in">
              <h2 className="mb-6 font-heading text-3xl font-bold text-brand-tealDark">
                Unlock Your Child's Potential Beyond the Screen
              </h2>

              <div className="rounded-2xl bg-gradient-to-r from-brand-tealDark to-brand-teal p-8 text-white">
                <p className="mb-6 text-lg">
                  Embracing screen-free coding activities for kids offers a powerful way to
                  cultivate essential computational thinking skills without the digital
                  distractions. It's about empowering children to think logically, solve problems
                  creatively, and understand the world around them in a structured yet playful
                  manner. By integrating these unplugged activities into their routine, you're not
                  just teaching coding; you're nurturing a resilient, resourceful, and imaginative
                  mind.
                </p>

                <p className="text-lg font-semibold">
                  Start small, stay consistent, and watch your child's confidence and
                  problem-solving abilities flourish. Explore our collection of educational games
                  and resources today to find the perfect tools for your family's unplugged learning
                  journey. Visit{" "}
                  <a href="/games" className="text-white underline hover:no-underline">
                    Logicology's games section
                  </a>{" "}
                  to discover engaging activities!
                </p>
              </div>
            </section>

            {/* Sources */}
            <section className="mb-12 animate-fade-in">
              <div className="rounded-2xl bg-white p-8 shadow-soft">
                <h3 className="mb-6 font-heading text-2xl font-bold text-brand-tealDark">
                  Sources
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="https://en.wikipedia.org/wiki/Computational_thinking"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-brand-teal hover:underline"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Computational Thinking - Wikipedia
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://en.wikipedia.org/wiki/E-commerce"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-brand-teal hover:underline"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      E-commerce - Wikipedia
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://en.wikipedia.org/wiki/Online_shopping"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-brand-teal hover:underline"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Online Shopping - Wikipedia
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://en.wikipedia.org/wiki/Educational_game"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-brand-teal hover:underline"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Educational Game - Wikipedia
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            {/* FAQ */}
            <section className="animate-fade-in">
              <div className="rounded-2xl bg-white p-8 shadow-soft">
                <h3 className="mb-6 font-heading text-2xl font-bold text-brand-tealDark">
                  Frequently Asked Questions About Screen-Free Coding
                </h3>

                <div className="space-y-8">
                  <div className="rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
                    <h4 className="mb-3 font-bold text-brand-tealDark">
                      What age are screen-free coding activities for?
                    </h4>
                    <p className="text-gray-700">
                      Screen-free coding activities can be adapted for children as young as 3 years
                      old (focusing on simple sequencing and patterns) up through middle school
                      (exploring more complex logic and algorithms). The key is to match the
                      activity's complexity to the child's developmental stage.
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
                    <h4 className="mb-3 font-bold text-brand-tealDark">
                      Do I need to know how to code to teach my child these activities?
                    </h4>
                    <p className="text-gray-700">
                      Absolutely not! The beauty of screen-free coding is that it focuses on the
                      fundamental concepts of computational thinking - logic, sequencing,
                      problem-solving - which you already use in daily life. You don't need to know
                      any programming languages to guide your child through these engaging
                      activities.
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
                    <h4 className="mb-3 font-bold text-brand-tealDark">
                      How often should we do these activities to be effective?
                    </h4>
                    <p className="text-gray-700">
                      Consistency is more important than duration. Even 15-30 minutes a few times a
                      week can make a significant difference. Integrating short, playful activities
                      into daily routines (like planning tasks) can also be very effective. The goal
                      is regular engagement, not long, intense sessions.
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
                    <h4 className="mb-3 font-bold text-brand-tealDark">
                      Are screen-free coding activities as effective as screen-based coding?
                    </h4>
                    <p className="text-gray-700">
                      Yes, in many ways, they are even more effective for building foundational
                      understanding. Unplugged activities remove the distraction of the screen and
                      allow children to grasp abstract concepts through tangible, hands-on
                      experience. They build a stronger conceptual framework, which then makes
                      screen-based coding easier and more meaningful later on.
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
                    <h4 className="mb-3 font-bold text-brand-tealDark">
                      Where can I find more ideas for screen-free coding activities?
                    </h4>
                    <p className="text-gray-700">
                      Many online resources, educational blogs, and books are dedicated to unplugged
                      coding. Websites like Code.org offer extensive unplugged curricula. You can
                      also explore board games designed to teach coding logic. Don't forget to check
                      out{" "}
                      <a href="/books" className="text-brand-teal hover:underline">
                        Logicology's book collection
                      </a>{" "}
                      and our{" "}
                      <a href="/games" className="text-brand-teal hover:underline">
                        games section
                      </a>{" "}
                      for curated ideas and products!
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Call to Action */}
          <div className="mt-16 animate-bounce-slow text-center">
            <div className="mb-8">
              <h3 className="mb-4 font-heading text-2xl font-bold text-brand-tealDark">
                Ready to Explore Screen-Free Coding?
              </h3>
              <p className="mx-auto mb-8 max-w-2xl text-gray-600">
                Discover our curated collection of unplugged coding games and activities designed to
                teach computational thinking without screens.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/games/coding-games"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-brand-teal to-brand-tealDark px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-brand"
              >
                <span>Explore Coding Games</span>
                <svg
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>

              <Link
                href="/unplugged-activities"
                className="to-pink group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-brand-coral px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-brand"
              >
                <span>View Unplugged Activities</span>
                <svg
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
