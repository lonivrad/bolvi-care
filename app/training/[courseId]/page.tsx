"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BackButton } from "@/components/ui/back-button";
import {
  BookOpen,
  Award,
  Clock,
  Play,
  CheckCircle,
  Star,
  Users,
  Brain,
  Shield,
  Pill,
  Scale,
  MessageSquare,
  ChevronRight,
  FileText,
  Target,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Lock,
  Check,
  AlertCircle,
} from "lucide-react";

// Course data (in a real app, this would come from an API)
const coursesData: Record<string, {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  enrolled: number;
  rating: number;
  certificate: boolean;
  icon: any;
  sources: string[];
  color: string;
  modules: Array<{
    id: string;
    title: string;
    duration: string;
    objectives: string[];
    topics: string[];
    content: string;
    quiz: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
  }>;
}> = {
  "safety-basics": {
    id: "safety-basics",
    title: "Safety Basics",
    description: "Essential safety training for non-licensed caregivers providing in-home support to older adults.",
    category: "Core Training",
    duration: "2.5 hours",
    enrolled: 3847,
    rating: 4.9,
    certificate: true,
    icon: Shield,
    sources: ["CDC", "OSHA", "NIH"],
    color: "blue",
    modules: [
      {
        id: "sb-1",
        title: "Fall Prevention & Risk Assessment",
        duration: "30 min",
        objectives: [
          "Identify fall risk factors in a home environment",
          "Conduct a basic home safety assessment",
          "Implement fall prevention strategies"
        ],
        topics: ["Environmental hazards", "Lighting assessment", "Furniture placement", "Footwear safety", "Bathroom safety"],
        content: `
# Fall Prevention & Risk Assessment

Falls are the leading cause of injury among older adults. As a caregiver, you play a critical role in preventing falls and keeping your clients safe.

## Key Risk Factors

According to the CDC, fall risk factors include:

- **Environmental hazards**: Loose rugs, cluttered walkways, poor lighting
- **Physical factors**: Muscle weakness, balance problems, vision issues
- **Medications**: Some medications can cause dizziness or drowsiness
- **Footwear**: Loose slippers, high heels, or walking in socks

## Home Safety Assessment

When entering a client's home, look for:

1. **Walkways**: Clear of obstacles? Wide enough for mobility aids?
2. **Lighting**: Adequate in hallways, stairs, bathrooms?
3. **Bathrooms**: Non-slip mats? Grab bars installed?
4. **Stairs**: Handrails on both sides? Non-slip treads?
5. **Furniture**: Stable chairs with armrests? Bed at proper height?

## Prevention Strategies

- Encourage proper footwear with non-slip soles
- Ensure walking paths are clear and well-lit
- Keep frequently used items within easy reach
- Recommend regular vision checks
- Report any new dizziness or balance issues to family/healthcare provider
        `,
        quiz: [
          {
            question: "Which of the following is NOT a common environmental fall risk factor?",
            options: ["Loose rugs on the floor", "Well-lit hallways", "Cluttered walkways", "Wet bathroom floors"],
            correctAnswer: 1,
            explanation: "Well-lit hallways actually REDUCE fall risk. Good lighting helps clients see obstacles and navigate safely."
          },
          {
            question: "A client refuses to use their walker. What should you do FIRST?",
            options: [
              "Force them to use it for their safety",
              "Ask why they don't want to use it and address their concerns",
              "Report them to their doctor immediately",
              "Remove the walker from the home"
            ],
            correctAnswer: 1,
            explanation: "Understanding why a client refuses to use their walker (embarrassment, difficulty, doesn't fit properly) helps you address the root cause and find solutions."
          },
          {
            question: "You notice your client's bathroom has no grab bars. What is the appropriate action?",
            options: [
              "Install grab bars yourself",
              "Document and report to family/supervisor as a safety concern",
              "Tell the client they can't use the bathroom",
              "It's not your responsibility"
            ],
            correctAnswer: 1,
            explanation: "Caregivers should document safety concerns and report to family or supervisors who can arrange for proper installation. Installing them yourself may not be within your scope."
          }
        ]
      },
      {
        id: "sb-2",
        title: "Safe Lifting & Body Mechanics",
        duration: "35 min",
        objectives: [
          "Demonstrate proper lifting techniques",
          "Safely assist a client from bed to chair",
          "Use transfer aids appropriately"
        ],
        topics: ["OSHA lifting guidelines", "Pivot transfers", "Gait belts", "Slide boards", "Preventing caregiver injury"],
        content: `
# Safe Lifting & Body Mechanics

Proper body mechanics protect both you and your client from injury. According to OSHA, back injuries are among the most common workplace injuries for caregivers.

## The ABCs of Safe Lifting

- **A**ssess the situation before lifting
- **B**end at knees, not waist
- **C**ommunicate with your client throughout

## Proper Lifting Technique

1. **Plan the move**: Know where you're going before you start
2. **Widen your base**: Feet shoulder-width apart, one foot slightly ahead
3. **Keep close**: Stay close to the person you're assisting
4. **Bend at knees**: Use your leg muscles, not your back
5. **Tighten core**: Engage your abdominal muscles
6. **Lift smoothly**: No jerking motions
7. **Pivot, don't twist**: Move your feet to turn, don't twist your spine

## Using a Gait Belt

A gait belt is a safety device worn around a client's waist during transfers:

1. Place belt around client's waist, over clothing
2. Fasten snugly (should fit 2 fingers underneath)
3. Grasp belt from underneath with both hands
4. Stand close to the client
5. Use the belt as a handle to guide movement

## When to Ask for Help

Always get assistance if:
- Client weighs significantly more than you
- Client cannot bear any weight
- You feel any strain or discomfort
- There isn't enough space for a safe transfer
        `,
        quiz: [
          {
            question: "When lifting, you should primarily use which part of your body?",
            options: ["Your back muscles", "Your leg muscles", "Your arm muscles", "Your shoulder muscles"],
            correctAnswer: 1,
            explanation: "Your leg muscles are the strongest in your body and should do most of the work during lifting to protect your back."
          },
          {
            question: "How tight should a gait belt be fastened?",
            options: [
              "As tight as possible for maximum grip",
              "Loose enough to slip on and off easily",
              "Snug enough to fit 2 fingers underneath",
              "It doesn't matter as long as it's on"
            ],
            correctAnswer: 2,
            explanation: "A gait belt should be snug but not restrictive - you should be able to fit two fingers underneath for comfort and safety."
          },
          {
            question: "If you feel strain during a transfer, you should:",
            options: [
              "Push through and complete the transfer",
              "Stop, reassess, and get help if needed",
              "Ask the client to help more",
              "Use faster movements to get it over with"
            ],
            correctAnswer: 1,
            explanation: "Pain or strain is your body's warning sign. Stop immediately, reassess the situation, and get assistance to prevent injury to yourself and your client."
          }
        ]
      },
      {
        id: "sb-3",
        title: "Emergency Response",
        duration: "40 min",
        objectives: [
          "Recognize signs of medical emergencies",
          "Activate emergency services appropriately",
          "Provide basic first aid until help arrives"
        ],
        topics: ["When to call 911", "Choking response", "Stroke signs (FAST)", "Heart attack symptoms", "Falls with injury"],
        content: `
# Emergency Response

Knowing how to recognize and respond to emergencies can save lives. As a caregiver, you're often the first responder when something goes wrong.

## When to Call 911

Call 911 immediately for:
- Chest pain or difficulty breathing
- Signs of stroke (FAST)
- Uncontrolled bleeding
- Loss of consciousness
- Severe allergic reaction
- Falls with head injury or inability to get up

## FAST: Recognizing Stroke

- **F**ace: Ask them to smile. Does one side droop?
- **A**rms: Ask them to raise both arms. Does one drift down?
- **S**peech: Ask them to repeat a simple phrase. Is it slurred?
- **T**ime: If ANY of these signs, call 911 immediately!

## Heart Attack Warning Signs

- Chest discomfort (pressure, squeezing, fullness)
- Discomfort in arms, back, neck, jaw, or stomach
- Shortness of breath
- Cold sweat, nausea, lightheadedness

**Important**: Symptoms may be different in women - less likely to have classic chest pain

## What to Do While Waiting for Help

1. Stay calm and reassure the client
2. Do not move them unless they're in immediate danger
3. Gather important information (medications, medical history)
4. Keep the phone line open for emergency services
5. Meet the ambulance at the door if possible
        `,
        quiz: [
          {
            question: "What does the 'F' in FAST stand for when checking for stroke?",
            options: ["Feet", "Face", "Fast", "Feeling"],
            correctAnswer: 1,
            explanation: "F stands for Face - ask the person to smile and check if one side of their face droops."
          },
          {
            question: "A client falls and hits their head but says they feel fine. What should you do?",
            options: [
              "If they say they're fine, continue with your regular activities",
              "Help them up immediately so they don't get cold on the floor",
              "Call for medical evaluation - head injuries can have delayed symptoms",
              "Give them aspirin for any potential pain"
            ],
            correctAnswer: 2,
            explanation: "Head injuries can have delayed symptoms. Even if the client feels fine initially, medical evaluation is recommended, especially for older adults on blood thinners."
          },
          {
            question: "While waiting for emergency services, you should:",
            options: [
              "Give the client water to help them feel better",
              "Try to move them to a more comfortable position",
              "Stay calm, reassure them, and gather their medical information",
              "Start performing CPR immediately"
            ],
            correctAnswer: 2,
            explanation: "Stay calm, reassure your client, and gather information emergency services will need (medications, medical history). Don't give food/water or move them unless necessary."
          }
        ]
      },
      {
        id: "sb-4",
        title: "Infection Prevention",
        duration: "25 min",
        objectives: [
          "Practice proper hand hygiene",
          "Use personal protective equipment correctly",
          "Implement infection control measures"
        ],
        topics: ["CDC hand hygiene guidelines", "PPE usage", "Cleaning vs disinfecting", "Respiratory hygiene"],
        content: `
# Infection Prevention

Proper infection control protects both you and your clients. Following CDC guidelines for hand hygiene and proper PPE use is essential.

## Hand Hygiene: The #1 Way to Prevent Infection

### When to Wash Hands:
- Before and after client contact
- Before preparing food
- After using the bathroom
- After coughing, sneezing, or blowing your nose
- Before and after wound care
- After removing gloves

### Proper Handwashing Technique (CDC):
1. Wet hands with clean water
2. Apply soap
3. Lather and scrub all surfaces for at least 20 seconds
4. Rinse thoroughly
5. Dry with clean towel or air dry

## Personal Protective Equipment (PPE)

Use PPE when:
- **Gloves**: Contact with body fluids, broken skin, or mucous membranes
- **Gowns**: Splashes or sprays of body fluids expected
- **Masks**: Client has respiratory illness
- **Eye protection**: Splashes to face possible

### Removing Gloves Safely:
1. Pinch outside of one glove at wrist
2. Peel off, turning inside out
3. Hold removed glove in gloved hand
4. Slide finger under wrist of remaining glove
5. Peel off over first glove
6. Dispose properly and wash hands immediately

## Cleaning vs. Disinfecting

- **Cleaning**: Removes dirt and some germs
- **Disinfecting**: Kills germs on surfaces

High-touch surfaces to disinfect regularly:
- Door handles
- Light switches
- Remote controls
- Bathroom surfaces
- Bed rails
        `,
        quiz: [
          {
            question: "According to CDC guidelines, how long should you wash your hands?",
            options: ["5 seconds", "At least 20 seconds", "1 minute", "Until the water runs clear"],
            correctAnswer: 1,
            explanation: "The CDC recommends washing hands for at least 20 seconds - about the time it takes to sing 'Happy Birthday' twice."
          },
          {
            question: "When removing gloves, the most important step is:",
            options: [
              "Removing them as quickly as possible",
              "Avoiding touching the outside of the gloves with bare hands",
              "Keeping them for reuse",
              "Shaking off any debris first"
            ],
            correctAnswer: 1,
            explanation: "The outside of gloves may be contaminated. Proper removal technique prevents contaminating your hands."
          },
          {
            question: "What is the difference between cleaning and disinfecting?",
            options: [
              "They are the same thing",
              "Cleaning removes dirt; disinfecting kills germs",
              "Disinfecting removes dirt; cleaning kills germs",
              "Cleaning is for floors; disinfecting is for counters"
            ],
            correctAnswer: 1,
            explanation: "Cleaning removes dirt and some germs, while disinfecting kills germs. Both are important for infection control."
          }
        ]
      }
    ]
  },
  "dementia-care": {
    id: "dementia-care",
    title: "Dementia Care Fundamentals",
    description: "Evidence-based approaches for providing compassionate care to individuals with Alzheimer's disease and other dementias.",
    category: "Specialized Care",
    duration: "3 hours",
    enrolled: 2156,
    rating: 4.8,
    certificate: true,
    icon: Brain,
    sources: ["NIH/NIA", "Alzheimer's Association", "CDC"],
    color: "purple",
    modules: [
      {
        id: "dc-1",
        title: "Understanding Dementia",
        duration: "35 min",
        objectives: [
          "Distinguish between normal aging and dementia symptoms",
          "Identify the stages of dementia progression",
          "Recognize common types of dementia"
        ],
        topics: ["Alzheimer's disease", "Vascular dementia", "Lewy body dementia", "Frontotemporal dementia", "Stages of progression"],
        content: `
# Understanding Dementia

Dementia is not a single disease but a general term for a decline in mental ability severe enough to interfere with daily life. As a caregiver, understanding dementia helps you provide better care.

## Dementia vs. Normal Aging

**Normal aging includes:**
- Occasionally forgetting names or appointments (but remembering later)
- Making occasional errors in checkbook balancing
- Sometimes needing help with settings on microwave or TV

**Signs of dementia include:**
- Memory loss that disrupts daily life
- Challenges in planning or solving problems
- Difficulty completing familiar tasks
- Confusion with time or place
- Problems with words in speaking or writing
- Misplacing things and losing ability to retrace steps
- Changes in mood and personality

## Types of Dementia

**Alzheimer's Disease (60-80% of cases)**
- Most common form
- Gradual onset
- Affects memory first, then other functions

**Vascular Dementia (5-10% of cases)**
- Caused by reduced blood flow to brain
- Often follows stroke
- May progress in steps rather than gradually

**Lewy Body Dementia**
- Causes visual hallucinations
- Fluctuating attention and alertness
- Movement problems similar to Parkinson's

**Frontotemporal Dementia**
- Affects personality and behavior first
- May occur at younger ages (40s-50s)

## The Stages of Alzheimer's

**Early Stage (Mild)**
- Independent in most activities
- May have memory lapses
- May struggle with finding words

**Middle Stage (Moderate)**
- Needs assistance with daily activities
- Confusion about time and place
- Personality changes, suspicion
- Sleep disturbances

**Late Stage (Severe)**
- Requires 24-hour care
- Loses awareness of surroundings
- Difficulty communicating
- Physical decline
        `,
        quiz: [
          {
            question: "Which of the following is a sign of dementia rather than normal aging?",
            options: [
              "Occasionally forgetting where you put your keys",
              "Memory loss that disrupts daily life and routines",
              "Taking longer to learn new technology",
              "Forgetting an acquaintance's name temporarily"
            ],
            correctAnswer: 1,
            explanation: "Memory loss that disrupts daily life is a warning sign of dementia. Normal aging includes occasional forgetfulness that doesn't significantly impact daily functioning."
          },
          {
            question: "Which type of dementia is most common?",
            options: ["Vascular dementia", "Lewy body dementia", "Alzheimer's disease", "Frontotemporal dementia"],
            correctAnswer: 2,
            explanation: "Alzheimer's disease accounts for 60-80% of all dementia cases, making it the most common type."
          },
          {
            question: "A client with dementia insists their deceased spouse is coming home for dinner. You should:",
            options: [
              "Firmly tell them their spouse has passed away",
              "Play along without correcting them",
              "Acknowledge their feelings and gently redirect",
              "Ignore the comment and change the subject abruptly"
            ],
            correctAnswer: 2,
            explanation: "Acknowledging feelings ('You must miss them') without harsh correction, then gently redirecting to another topic, is the most compassionate and effective approach."
          }
        ]
      },
      {
        id: "dc-2",
        title: "Communication Strategies",
        duration: "40 min",
        objectives: [
          "Apply effective verbal communication techniques",
          "Use non-verbal communication to enhance understanding",
          "Adapt communication as dementia progresses"
        ],
        topics: ["Simple language", "Yes/no questions", "Visual cues", "Active listening", "Non-verbal communication"],
        content: `
# Communication Strategies for Dementia Care

Effective communication is one of the most important skills for dementia caregivers. As the disease progresses, you'll need to adapt your approach.

## General Communication Principles

**DO:**
- Approach from the front and identify yourself
- Speak slowly and clearly
- Use simple words and short sentences
- Allow plenty of time for response
- Maintain eye contact
- Use a calm, reassuring tone

**DON'T:**
- Talk down to or patronize
- Argue or try to convince with logic
- Ask "Don't you remember?"
- Talk about the person as if they're not there
- Rush or show impatience

## Verbal Communication Techniques

### Use Simple Language
- Instead of: "Would you like to have some lunch now or would you prefer to wait?"
- Say: "Let's have lunch now."

### Ask Yes/No Questions
- Instead of: "What would you like to wear today?"
- Say: "Do you want to wear the blue shirt?" (while showing it)

### One Step at a Time
- Instead of: "Go to the bathroom and wash your hands before lunch"
- Say: "Let's go to the bathroom" → then "Let's wash your hands"

### Offer Choices Carefully
- Limit to two options
- Show visual options when possible

## Non-Verbal Communication

Non-verbal cues become increasingly important:

- **Facial expressions**: Smile, look calm and friendly
- **Body language**: Open posture, relaxed stance
- **Touch**: Gentle touch can be reassuring (if welcome)
- **Pointing/Gesturing**: Show what you mean
- **Modeling**: Demonstrate what you're asking

## Adapting to Each Stage

**Early Stage:**
- Normal conversation usually still works
- May need occasional reminders or extra time

**Middle Stage:**
- Use shorter sentences
- Rely more on visual cues
- Expect repetitive questions

**Late Stage:**
- Focus on tone and touch
- Use simple words or sounds
- Presence may be more important than words
        `,
        quiz: [
          {
            question: "When communicating with someone who has dementia, you should:",
            options: [
              "Speak quickly to keep them engaged",
              "Use complex sentences to stimulate their brain",
              "Speak slowly and use simple, short sentences",
              "Avoid eye contact as it may be overwhelming"
            ],
            correctAnswer: 2,
            explanation: "Speaking slowly with simple, short sentences helps people with dementia process information more easily. Eye contact and a calm tone are also important."
          },
          {
            question: "Your client asks the same question for the fifth time in an hour. The best response is to:",
            options: [
              "Say 'I already told you that' to help them remember",
              "Answer patiently each time as if it's the first time",
              "Ignore the question to discourage repetition",
              "Write the answer down and point to it each time"
            ],
            correctAnswer: 1,
            explanation: "Answer patiently each time. Repetitive questions are a symptom of dementia, not intentional. Getting frustrated won't help and may cause distress."
          },
          {
            question: "As dementia progresses to later stages, communication should focus more on:",
            options: [
              "Written instructions",
              "Detailed verbal explanations",
              "Tone, touch, and non-verbal cues",
              "Logic and reasoning"
            ],
            correctAnswer: 2,
            explanation: "In later stages, people with dementia respond more to tone of voice, gentle touch, and presence than to words. Non-verbal communication becomes primary."
          }
        ]
      },
      {
        id: "dc-3",
        title: "Managing Behavioral Changes",
        duration: "45 min",
        objectives: [
          "Identify triggers for behavioral symptoms",
          "Apply de-escalation techniques",
          "Develop strategies for common challenging behaviors"
        ],
        topics: ["Agitation triggers", "Sundowning", "Wandering", "Aggression", "De-escalation", "Redirection"],
        content: `
# Managing Behavioral Changes

Behavioral changes are common in dementia. Understanding that these behaviors have underlying causes helps you respond with compassion and effectiveness.

## The ABC Approach

**A - Antecedent (What happened before?)**
- What was happening right before the behavior?
- What might have triggered it?

**B - Behavior (What is the behavior?)**
- Describe exactly what you observe
- Avoid judgmental labels

**C - Consequence (What happens after?)**
- How do others respond?
- Does the response help or make things worse?

## Common Behaviors and Strategies

### Agitation and Anxiety

**Possible causes:**
- Overstimulation (noise, activity, visitors)
- Pain or physical discomfort
- Hunger, thirst, need to use bathroom
- Fatigue
- Change in routine or environment

**Strategies:**
- Create a calm environment
- Check physical needs
- Speak softly and reassuringly
- Offer a favorite activity or object
- Consider a change of scenery

### Sundowning

Increased confusion and agitation in late afternoon/evening.

**Strategies:**
- Maintain a consistent routine
- Increase light in the afternoon
- Limit caffeine and sugar
- Plan demanding activities for morning
- Create a calm evening routine

### Wandering

**Safety measures:**
- Ensure ID is always worn
- Install door alarms
- Secure hazardous areas
- Create a safe wandering path
- Address possible needs (looking for bathroom, bored)

### Aggression

**When facing aggression:**
1. Stay calm - don't react with anger or fear
2. Give space - step back, don't corner them
3. Speak softly - use their name, reassure
4. Don't argue - agreement reduces conflict
5. Identify the cause - pain? Fear? Frustration?
6. Know when to step away and get help

## De-escalation Techniques

**HALT** - Check if they are:
- **H**ungry
- **A**ngry/Anxious
- **L**onely
- **T**ired

**Validation:**
- Acknowledge their feelings
- "I can see you're upset"
- "That sounds frustrating"

**Redirection:**
- Gently shift attention to something pleasant
- "Let's look at these photos"
- "Would you like some music?"

## What NOT to Do

- Don't take behaviors personally
- Don't argue or try to reason
- Don't restrain unless safety emergency
- Don't punish or scold
- Don't assume they're being difficult on purpose
        `,
        quiz: [
          {
            question: "A client becomes agitated every afternoon around 4pm. This pattern is likely:",
            options: [
              "Attention-seeking behavior",
              "Sundowning - a common symptom in dementia",
              "Manipulation to avoid activities",
              "Unrelated to dementia"
            ],
            correctAnswer: 1,
            explanation: "Sundowning is a pattern of increased confusion and agitation that occurs in late afternoon and evening, common in people with dementia."
          },
          {
            question: "A client with dementia becomes aggressive when you try to help them dress. The FIRST thing you should do is:",
            options: [
              "Firmly insist they need to get dressed",
              "Step back, give them space, and speak calmly",
              "Call for help immediately",
              "Explain why getting dressed is important"
            ],
            correctAnswer: 1,
            explanation: "When facing aggression, first ensure safety by stepping back and giving space. Speak calmly and reassuringly. Don't argue or insist - you can try again in a few minutes."
          },
          {
            question: "The ABC approach to understanding behaviors stands for:",
            options: [
              "Always Be Calm",
              "Antecedent, Behavior, Consequence",
              "Assessment, Baseline, Care",
              "Attention, Boundaries, Compassion"
            ],
            correctAnswer: 1,
            explanation: "ABC stands for Antecedent (what triggered it), Behavior (what happened), and Consequence (what came after). This helps identify patterns and triggers."
          }
        ]
      },
      {
        id: "dc-4",
        title: "Creating a Supportive Environment",
        duration: "30 min",
        objectives: [
          "Modify the home environment for safety and comfort",
          "Establish routines that reduce confusion",
          "Promote meaningful activities and engagement"
        ],
        topics: ["Environmental modifications", "Daily routines", "Activity planning", "Music therapy", "Validation therapy"],
        content: `
# Creating a Supportive Environment

The right environment can significantly improve quality of life for people with dementia. Your goal is to create a space that is safe, calm, and supports independence.

## Environmental Modifications

### Lighting
- Maximize natural light during the day
- Install nightlights in hallways and bathrooms
- Reduce shadows that may cause confusion or fear

### Reduce Clutter
- Clear walkways
- Minimize decorative items that may confuse
- Create clear, simple spaces

### Visual Cues
- Label drawers and cabinets with pictures
- Use contrasting colors (light plate on dark placemat)
- Place colorful tape on edges of stairs

### Safety Measures
- Remove or secure throw rugs
- Install grab bars in bathroom
- Lock away medications, cleaning supplies, sharp objects
- Cover or remove mirrors if they cause distress
- Disable stove when not supervised

## The Power of Routine

Consistent routines provide security and reduce anxiety:

- Wake up at the same time each day
- Follow the same sequence of activities
- Eat meals at regular times
- Have a calming bedtime routine

**Sample Daily Routine:**
1. Morning: Wake, toilet, wash, dress, breakfast
2. Mid-morning: Light activity or walk
3. Noon: Lunch, rest time
4. Afternoon: Activity, snack
5. Evening: Dinner, quiet activity, prepare for bed
6. Night: Bedtime routine

## Meaningful Activities

Activities should be:
- Adapted to current abilities
- Based on past interests
- Simple and achievable
- Not childish or demeaning

**Activity Ideas:**
- Looking at photo albums
- Listening to favorite music
- Simple gardening or watering plants
- Folding towels or sorting items
- Gentle exercise or stretching
- Art activities (coloring, painting)
- Pet visits or stuffed animals

## Music and Memory

Music is powerful for people with dementia:
- Can trigger memories and emotions
- May improve mood and reduce agitation
- Familiar songs from their past work best
- Can be calming during difficult times

## Maintaining Dignity

Always:
- Give choices when possible
- Allow them to do what they can
- Respect privacy
- Speak to them with respect
- Include them in conversations
- Focus on what they CAN do
        `,
        quiz: [
          {
            question: "Why are consistent daily routines important for people with dementia?",
            options: [
              "To make the caregiver's job easier",
              "To keep them busy and occupied",
              "To provide security and reduce confusion and anxiety",
              "Because they can no longer make their own choices"
            ],
            correctAnswer: 2,
            explanation: "Consistent routines provide a sense of security and predictability, which reduces anxiety and confusion for people with dementia."
          },
          {
            question: "When choosing activities for someone with dementia, you should:",
            options: [
              "Choose activities designed for children since they're simple",
              "Select challenging activities to stimulate their brain",
              "Base activities on their current abilities and past interests",
              "Avoid activities to prevent frustration"
            ],
            correctAnswer: 2,
            explanation: "Activities should be adapted to current abilities while respecting past interests. They should be achievable but not childish or demeaning."
          },
          {
            question: "Why is music particularly effective for people with dementia?",
            options: [
              "It keeps them distracted",
              "Musical memories often remain even when other memories fade",
              "It prevents them from talking",
              "It's the only activity they can still do"
            ],
            correctAnswer: 1,
            explanation: "Music is processed in parts of the brain that are often less affected by dementia. Familiar songs can trigger memories, improve mood, and provide comfort."
          }
        ]
      }
    ]
  },
  "medication-awareness": {
    id: "medication-awareness",
    title: "Medication Awareness",
    description: "Understanding medication safety, what non-licensed caregivers can and cannot do, and recognizing potential problems.",
    category: "Safety & Compliance",
    duration: "2 hours",
    enrolled: 2891,
    rating: 4.7,
    certificate: true,
    icon: Pill,
    sources: ["FDA", "CMS", "State Regulations"],
    color: "green",
    modules: [
      {
        id: "ma-1",
        title: "Caregiver Scope: What You Can & Cannot Do",
        duration: "30 min",
        objectives: [
          "Distinguish between administering and assisting with medications",
          "Identify tasks within a non-licensed caregiver's scope",
          "Recognize when to refer to licensed personnel"
        ],
        topics: ["Scope of practice", "Assisting vs administering", "State regulations", "When to refer"],
        content: `
# Caregiver Scope: What You Can & Cannot Do

As a non-licensed caregiver, understanding your scope of practice regarding medications is critical for both legal compliance and client safety.

## The Difference: Assisting vs. Administering

**Assisting with Medications (Usually Allowed):**
- Reminding a client to take their medication
- Handing a client their medication container
- Reading the label to them
- Opening a container if they have difficulty
- Getting water to take with medication
- Providing general supervision

**Administering Medications (Usually NOT Allowed):**
- Deciding which medication to give
- Determining dosages
- Crushing, splitting, or mixing medications
- Giving injections
- Applying prescription creams or ointments
- Inserting suppositories
- Administering eye/ear drops

## Important: State Laws Vary

Medication rules vary significantly by state. Some states allow trained caregivers to do more, others have stricter limits.

**Always know:**
- Your state's specific regulations
- Your agency's policies
- The care plan for each client

**When in doubt, ask your supervisor!**

## What You SHOULD Do

✓ Observe the client taking their medication
✓ Document that medication was taken
✓ Report any concerns or refusals
✓ Ensure medications are stored properly
✓ Note any changes in the client

## What You Should NEVER Do

✗ Give professional medical advice
✗ Change a medication schedule
✗ Tell a client to skip a dose
✗ Share one client's medication with another
✗ Dispose of medications without proper guidance
✗ Accept responsibility beyond your training

## When to Contact Supervisor or Healthcare Provider

- Client refuses medication
- Client seems confused about their medications
- You suspect medication errors or missing doses
- Client experiences potential side effects
- New medication is added
- You're asked to do something outside your scope
        `,
        quiz: [
          {
            question: "A client asks you to crush their pills because they have trouble swallowing. You should:",
            options: [
              "Crush the pills to help them take their medication",
              "Explain that crushing medications is outside your scope and contact their pharmacist or nurse",
              "Tell them to skip the medication",
              "Cut the pills in half instead"
            ],
            correctAnswer: 1,
            explanation: "Crushing medications can change how they work and may be dangerous. This is outside a non-licensed caregiver's scope. Contact a pharmacist or nurse for guidance."
          },
          {
            question: "Which of the following is typically within a non-licensed caregiver's scope?",
            options: [
              "Deciding when a client should take their pain medication",
              "Giving insulin injections",
              "Reminding a client to take their medication and handing them the container",
              "Applying prescription antibiotic ointment"
            ],
            correctAnswer: 2,
            explanation: "Reminding clients and handing them their medication container is assisting, which is typically allowed. Administering medications (injections, applying prescription creams) is usually not allowed for non-licensed caregivers."
          },
          {
            question: "Your client's daughter asks you to give her mother an extra blood pressure pill because 'she seems stressed.' You should:",
            options: [
              "Give the extra pill since family requested it",
              "Decline and explain you cannot change medication dosages - suggest she contact the doctor",
              "Give half a pill as a compromise",
              "Wait and see if the client seems better later"
            ],
            correctAnswer: 1,
            explanation: "Even with family approval, changing medication dosages is never within a caregiver's scope. Extra blood pressure medication can be dangerous. Refer to the healthcare provider."
          }
        ]
      },
      {
        id: "ma-2",
        title: "Recognizing Medication Problems",
        duration: "35 min",
        objectives: [
          "Identify common side effects and adverse reactions",
          "Recognize signs of medication interactions",
          "Spot potential medication errors"
        ],
        topics: ["Common side effects", "Drug interactions", "Signs of overdose", "Allergic reactions", "Error prevention"],
        content: `
# Recognizing Medication Problems

Your observations can be crucial in identifying medication-related problems early. Knowing what to watch for may prevent serious harm.

## Common Side Effects to Watch For

**Drowsiness/Sedation**
- Common with: Pain medications, sleep aids, antihistamines, some blood pressure meds
- Concern: Increases fall risk, affects daily function

**Dizziness**
- Common with: Blood pressure medications, heart medications
- Concern: Fall risk, especially when standing up quickly

**Confusion**
- Common with: Many medications in older adults
- Concern: May be mistaken for dementia progression

**Digestive Issues**
- Nausea, constipation, diarrhea
- Common with: Antibiotics, pain medications, iron supplements

**Changes in Appetite**
- Some medications suppress appetite
- Others may increase appetite

## Warning Signs Requiring Immediate Attention

**Call 911 or seek emergency care for:**
- Difficulty breathing
- Severe swelling (face, throat, tongue)
- Severe rash or hives
- Chest pain
- Severe confusion or disorientation
- Loss of consciousness
- Signs of overdose

**Signs of Allergic Reaction:**
- Rash, hives, itching
- Swelling
- Difficulty breathing
- Rapid heartbeat

## Drug Interactions

**Medications can interact with:**
- Other medications
- Food and drinks (grapefruit juice, alcohol)
- Supplements and vitamins
- Over-the-counter medications

**Warning signs of interactions:**
- Medication seems less effective
- Unexpected side effects
- Symptoms that worsen rather than improve

## Medication Errors: What to Watch For

**Common errors:**
- Wrong medication taken
- Wrong dose
- Wrong time
- Missed doses
- Double doses
- Medication taken with contraindicated food

**Prevention:**
- Check medications against the care plan
- Use pill organizers
- Maintain medication lists
- Watch for "look-alike" medications

## Your Role in Medication Safety

1. **Observe** - Watch for changes after taking medications
2. **Document** - Keep accurate records of what was taken and when
3. **Report** - Communicate any concerns immediately
4. **Don't diagnose** - Report observations, not conclusions
        `,
        quiz: [
          {
            question: "Your client started a new medication yesterday and now has a rash and swelling. You should:",
            options: [
              "Wait to see if it goes away",
              "Give them antihistamine from the medicine cabinet",
              "Stop the medication and call the doctor/911 - this may be an allergic reaction",
              "Apply lotion to the rash"
            ],
            correctAnswer: 2,
            explanation: "Rash and swelling after starting a new medication are signs of possible allergic reaction, which can become life-threatening. Seek medical attention immediately."
          },
          {
            question: "An older client seems more confused than usual. What should you consider?",
            options: [
              "Their dementia must be getting worse",
              "They're probably just tired",
              "It could be medication-related - document and report to supervisor/healthcare provider",
              "This is normal for their age"
            ],
            correctAnswer: 2,
            explanation: "New confusion in older adults is often medication-related. Many medications can cause confusion, especially in seniors. This should always be reported and investigated."
          },
          {
            question: "You notice your client's pill organizer has two of the same pills in today's slot, but there should only be one. You should:",
            options: [
              "Remove one pill since you know the correct dose",
              "Give both pills since they're already in the organizer",
              "Report the discrepancy to your supervisor before the client takes any medication",
              "Ask the client which is correct"
            ],
            correctAnswer: 2,
            explanation: "Never assume you know the correct dose. Report any medication discrepancies to your supervisor before the client takes the medication. This prevents potential overdose."
          }
        ]
      },
      {
        id: "ma-3",
        title: "Documentation & Communication",
        duration: "25 min",
        objectives: [
          "Maintain accurate medication records",
          "Communicate effectively with healthcare team",
          "Document observations professionally"
        ],
        topics: ["Medication logs", "MAR documentation", "Shift communication", "Reporting concerns"],
        content: `
# Documentation & Communication

Accurate documentation and clear communication are essential for medication safety. Your records may be the key to identifying problems.

## Why Documentation Matters

- Ensures continuity of care between caregivers
- Provides legal protection for you and your client
- Helps healthcare providers make informed decisions
- Tracks patterns that may indicate problems
- Required by regulations and agencies

## What to Document

**For each medication assistance:**
- Date and time
- Name of medication
- Whether it was taken
- Who assisted/observed
- Any concerns or issues

**Also document:**
- Medication refusals and reasons
- Any symptoms or side effects observed
- Changes in client condition
- Communications with healthcare providers

## The 5 Rights of Medication Documentation

Before documenting, verify:
1. **Right Client** - Is this the correct person?
2. **Right Medication** - Is this the medication listed?
3. **Right Dose** - Is this the amount ordered?
4. **Right Time** - Is this the scheduled time?
5. **Right Route** - Is this how it's supposed to be taken?

## How to Write Good Documentation

**DO:**
- Write clearly and legibly
- Use objective language ("client stated" not "client complained")
- Document immediately or as soon as possible
- Include specific details (time, observations)
- Sign your entries

**DON'T:**
- Use vague terms ("seems fine")
- Write opinions or judgments
- Leave blank spaces
- Use correction fluid - cross out errors with single line
- Document ahead of time

## Communication Best Practices

**When reporting to supervisor:**
1. State who you are and which client
2. Describe what you observed
3. Note when it started
4. Mention any relevant context
5. Ask any questions you have

**SBAR Format for Reporting:**
- **S**ituation: What's happening now?
- **B**ackground: Relevant history
- **A**ssessment: What you've observed
- **R**ecommendation: What you think should happen

## Shift-to-Shift Communication

When handing off to another caregiver:
- Review medication schedule
- Note any refusals or problems
- Share relevant observations
- Clarify any questions
        `,
        quiz: [
          {
            question: "You assisted a client with their medication but forgot to document it. What should you do?",
            options: [
              "Just remember to document next time",
              "Document it now with the actual time it was given and note 'late entry'",
              "Ask another caregiver to document for you",
              "Change the documentation time to look like it was done on time"
            ],
            correctAnswer: 1,
            explanation: "Document as soon as you can with the actual time the medication was taken. Note it as a 'late entry' to maintain accuracy. Never falsify documentation times."
          },
          {
            question: "Which of the following is proper documentation?",
            options: [
              "Client was grumpy about taking meds",
              "Meds given at 8am",
              "Client stated 'I don't want to take this pill.' Medication refused at 8:15am. Supervisor notified.",
              "Everything fine today"
            ],
            correctAnswer: 2,
            explanation: "Good documentation is specific, objective (using quotes for client statements), includes times, and notes follow-up actions taken."
          },
          {
            question: "The 5 Rights of medication documentation include all EXCEPT:",
            options: [
              "Right client",
              "Right medication",
              "Right caregiver",
              "Right time"
            ],
            correctAnswer: 2,
            explanation: "The 5 Rights are: Right Client, Right Medication, Right Dose, Right Time, and Right Route. 'Right caregiver' is not one of the 5 Rights."
          }
        ]
      },
      {
        id: "ma-4",
        title: "Medication Storage & Safety",
        duration: "20 min",
        objectives: [
          "Store medications safely and properly",
          "Identify expired or compromised medications",
          "Maintain medication security"
        ],
        topics: ["Storage requirements", "Expiration dates", "Controlled substances", "Disposal guidelines"],
        content: `
# Medication Storage & Safety

Proper storage ensures medications remain effective and safe. As a caregiver, you should know how to maintain medication safety in the home.

## General Storage Guidelines

**Most medications need:**
- Cool, dry place
- Away from direct sunlight
- Away from heat sources
- Out of bathrooms (humidity damages many medications)
- At proper temperature

**Some medications require:**
- Refrigeration (insulin, some liquids)
- Room temperature only
- Protection from light
- Check labels for specific instructions

## Checking Expiration Dates

**Expired medications can:**
- Be less effective
- Break down into harmful compounds
- Cause unexpected reactions

**Check expiration dates:**
- When assisting with medications
- When organizing pill boxes
- At least monthly during routine care

## Signs a Medication May Be Compromised

- Past expiration date
- Change in color
- Unusual smell
- Tablets crumbling or sticky
- Capsules stuck together
- Liquid is cloudy or has particles
- Cream is separated or dried out

**If you notice any of these, do not use - notify supervisor**

## Controlled Substances

Some medications are controlled substances (pain medications, some anxiety medications):

**Handle with extra care:**
- Never take any for yourself
- Count should match records
- Report any discrepancies immediately
- Never share between clients
- Secure storage is required

## Medication Security

**Keep medications safe from:**
- Children visiting the home
- Confused clients who may take extra
- Visitors who may take medications
- Mix-ups with other household members

**Security measures:**
- Lock boxes for controlled substances
- High or locked cabinets
- Supervision during medication times

## Disposal Guidelines

**DO NOT:**
- Flush most medications down toilet
- Throw in regular trash
- Give to others

**Proper disposal:**
- Drug take-back programs
- Pharmacy disposal
- Follow FDA guidelines for home disposal when necessary
- Ask supervisor for agency policy

**For home disposal (when no other option):**
1. Mix medications with coffee grounds or cat litter
2. Place in sealed container
3. Remove personal information from bottles
4. Place in trash
        `,
        quiz: [
          {
            question: "Where is the BEST place to store most medications?",
            options: [
              "In the bathroom medicine cabinet for easy access",
              "In a cool, dry place away from the bathroom",
              "On the kitchen counter where they can be seen",
              "In the refrigerator to keep them fresh"
            ],
            correctAnswer: 1,
            explanation: "Most medications should be stored in a cool, dry place. Bathrooms are actually poor choices due to heat and humidity from showers, which can degrade medications."
          },
          {
            question: "You notice a liquid medication looks cloudy and has particles floating in it. You should:",
            options: [
              "Shake it well and use it",
              "Filter out the particles and use the liquid",
              "Do not use it and notify your supervisor",
              "Use it anyway since it's not expired"
            ],
            correctAnswer: 2,
            explanation: "Cloudy liquid with particles is a sign the medication may be compromised. Do not use it - even if it's not expired - and notify your supervisor."
          },
          {
            question: "The proper way to dispose of unused medications at home (when no take-back program is available) is to:",
            options: [
              "Flush them down the toilet",
              "Put them in the regular trash as-is",
              "Mix with coffee grounds or cat litter, seal in container, then dispose",
              "Give them to a friend who might need them"
            ],
            correctAnswer: 2,
            explanation: "When no take-back program is available, FDA guidelines recommend mixing medications with undesirable substances like coffee grounds, sealing in a container, and placing in trash."
          }
        ]
      }
    ]
  },
  "ethics-boundaries": {
    id: "ethics-boundaries",
    title: "Professional Boundaries & Ethics",
    description: "Understanding your professional role, recognizing abuse and neglect, and maintaining appropriate boundaries.",
    category: "Professionalism",
    duration: "2 hours",
    enrolled: 1834,
    rating: 4.8,
    certificate: true,
    icon: Scale,
    sources: ["CMS", "Adult Protective Services", "State Licensing"],
    color: "amber",
    modules: [
      {
        id: "eb-1",
        title: "Recognizing Abuse & Neglect",
        duration: "40 min",
        objectives: [
          "Identify signs of physical, emotional, and financial abuse",
          "Recognize signs of neglect and self-neglect",
          "Understand mandatory reporting obligations"
        ],
        topics: ["Physical abuse signs", "Emotional abuse", "Financial exploitation", "Neglect indicators", "Mandatory reporting"],
        content: `
# Recognizing Abuse & Neglect

Elder abuse is a serious problem affecting millions of older adults. As a caregiver, you are often in the best position to recognize signs of abuse or neglect.

## Types of Abuse

### Physical Abuse
Intentional use of force resulting in injury, pain, or impairment.

**Signs include:**
- Unexplained bruises, welts, cuts, or burns
- Injuries in various stages of healing
- Injuries inconsistent with explanations
- Broken eyeglasses or frames
- Reluctance to be around certain people
- Flinching or pulling away when touched

### Emotional/Psychological Abuse
Causing mental anguish through verbal or nonverbal acts.

**Signs include:**
- Withdrawal or depression
- Unusual changes in behavior
- Fearfulness or anxiety
- Caregiver treating them like a child
- Threatening, belittling, or controlling behavior witnessed
- Changes when certain people are present

### Financial Exploitation
Illegal or improper use of an elder's funds or property.

**Signs include:**
- Sudden changes in financial situation
- Missing money or valuables
- Unpaid bills despite having money
- Unusual changes to will or power of attorney
- New "friends" taking unusual interest in finances
- Giving expensive gifts to caregivers

### Sexual Abuse
Non-consensual sexual contact of any kind.

**Signs include:**
- Unexplained injuries to genital area
- Bruising on inner thighs
- Torn or bloody undergarments
- STDs or vaginal/rectal bleeding
- Fearfulness around certain individuals

## Neglect

### Neglect by Others
Failure by caregivers to fulfill caregiving obligations.

**Signs include:**
- Dehydration or malnutrition
- Unattended medical needs
- Poor personal hygiene
- Unsafe or unclean living conditions
- Pressure sores (bed sores)
- Leaving person alone for extended periods

### Self-Neglect
When a person fails to care for themselves.

**Signs include:**
- Poor hygiene
- Inadequate nutrition
- Not taking necessary medications
- Living in hazardous conditions
- Refusing needed assistance

## Mandatory Reporting

As a caregiver, you may be a mandatory reporter. This means:

- You are REQUIRED by law to report suspected abuse
- You report to Adult Protective Services (APS) or the designated agency
- You don't need proof - reasonable suspicion is enough
- You are protected from liability for good-faith reports
- NOT reporting can have legal consequences

**When in doubt, report!**

## How to Report

1. **Document** your observations objectively
2. **Report** to your supervisor immediately
3. **Call APS** or the appropriate hotline
4. **Cooperate** with any investigation
5. **Maintain confidentiality** - only discuss with appropriate parties
        `,
        quiz: [
          {
            question: "You notice your client has unexplained bruises on their arms in different stages of healing. You should:",
            options: [
              "Ask the client directly if someone is hurting them",
              "Document your observations and report to your supervisor and/or Adult Protective Services",
              "Wait to see if more bruises appear before doing anything",
              "Assume the client is just clumsy and bruises easily"
            ],
            correctAnswer: 1,
            explanation: "Unexplained bruises in various stages of healing are a potential sign of physical abuse. Document objectively and report to your supervisor and/or APS. You don't need proof to report."
          },
          {
            question: "Which of the following is a sign of potential financial exploitation?",
            options: [
              "The client manages their own checkbook",
              "Unpaid bills despite having adequate funds, or sudden changes in financial situation",
              "The client makes regular gifts to family members on holidays",
              "The client hired a financial advisor"
            ],
            correctAnswer: 1,
            explanation: "Unpaid bills when the person has money, sudden changes in financial situation, or unusual gifts to new 'friends' or caregivers can indicate financial exploitation."
          },
          {
            question: "As a mandatory reporter, you must report suspected abuse:",
            options: [
              "Only if you have definitive proof",
              "Only if the client asks you to",
              "When you have reasonable suspicion, even without proof",
              "Only if your supervisor tells you to"
            ],
            correctAnswer: 2,
            explanation: "Mandatory reporters must report when they have reasonable suspicion. You don't need proof - investigations determine if abuse occurred. When in doubt, report."
          }
        ]
      },
      {
        id: "eb-2",
        title: "Your Scope of Role",
        duration: "30 min",
        objectives: [
          "Define the boundaries of a non-licensed caregiver role",
          "Identify tasks that require licensed professionals",
          "Recognize when to seek guidance"
        ],
        topics: ["Role definition", "Licensed vs unlicensed tasks", "Care plan adherence", "Knowing your limits"],
        content: `
# Your Scope of Role

Understanding what you can and cannot do as a non-licensed caregiver protects you and your clients. Staying within your scope ensures safe, legal care.

## Your Role as a Non-Licensed Caregiver

**You ARE qualified to:**
- Provide companionship and emotional support
- Assist with activities of daily living (bathing, dressing, toileting)
- Prepare meals and assist with eating
- Light housekeeping and laundry
- Transportation and errands
- Medication reminders (not administration in most states)
- Observe and report changes in condition
- Follow the established care plan

**You are NOT qualified to:**
- Provide medical diagnosis or advice
- Administer medications or injections
- Perform medical procedures
- Change wound dressings (in most cases)
- Make decisions about medical care
- Override the care plan

## Following the Care Plan

Every client should have a care plan that outlines:
- What services you provide
- How tasks should be performed
- Specific client needs and preferences
- Emergency contacts and procedures
- Any restrictions or special instructions

**Important:**
- Always follow the care plan
- Don't add or remove tasks without authorization
- If something seems wrong with the plan, report it
- Document any deviations and reasons

## Knowing Your Limits

**Physical limits:**
- Don't lift beyond your ability
- Don't work when ill
- Don't ignore your own safety

**Professional limits:**
- Don't diagnose conditions
- Don't recommend treatments
- Don't provide services you're not trained for
- Don't take on nursing tasks

**Emotional limits:**
- Recognize caregiver burnout signs
- Seek support when needed
- Maintain healthy boundaries

## When to Seek Guidance

Ask your supervisor when:
- Asked to do something outside the care plan
- Unsure if a task is within your scope
- Client's condition changes significantly
- Family asks you to do something new
- You feel uncomfortable with a request
- Something doesn't seem right
        `,
        quiz: [
          {
            question: "A client's family member asks you to change their wound dressing. You should:",
            options: [
              "Do it since family asked",
              "Politely decline and explain this is outside your scope - a nurse should handle wound care",
              "Do it just this once to help out",
              "Watch a YouTube video and then try it"
            ],
            correctAnswer: 1,
            explanation: "Wound care is typically a nursing task outside the scope of non-licensed caregivers. Politely explain this and help arrange for proper wound care."
          },
          {
            question: "The care plan says to assist the client with a shower every other day, but the client wants to shower daily. You should:",
            options: [
              "Follow the client's wishes since they know what they want",
              "Refuse to help with any showers",
              "Discuss with your supervisor to update the care plan if appropriate",
              "Alternate between the care plan and client's wishes"
            ],
            correctAnswer: 2,
            explanation: "Always follow the care plan, but advocate for your client. If the client's needs have changed, communicate with your supervisor about updating the plan."
          },
          {
            question: "Which of the following is within a non-licensed caregiver's typical scope?",
            options: [
              "Recommending over-the-counter medications",
              "Assisting with bathing, dressing, and meal preparation",
              "Deciding when to give pain medication",
              "Adjusting medical equipment settings"
            ],
            correctAnswer: 1,
            explanation: "Assisting with activities of daily living like bathing, dressing, and meals is within scope. Medical decisions, medication recommendations, and equipment adjustments are not."
          }
        ]
      },
      {
        id: "eb-3",
        title: "Professional Boundaries",
        duration: "25 min",
        objectives: [
          "Maintain appropriate professional boundaries",
          "Recognize boundary violations",
          "Handle situations when boundaries are tested"
        ],
        topics: ["Boundary definition", "Common boundary issues", "Gifts and money", "Personal relationships", "Social media"],
        content: `
# Professional Boundaries

Professional boundaries are the limits that protect both you and your clients. They help maintain a safe, professional caregiving relationship.

## What Are Professional Boundaries?

Boundaries define:
- The scope of your role
- Appropriate behavior and relationships
- Limits on personal involvement
- Professional vs personal interactions

**Why boundaries matter:**
- Protect client vulnerability
- Maintain professional objectivity
- Prevent exploitation (both directions)
- Ensure consistent, quality care
- Protect your career

## Common Boundary Issues

### Gifts and Money

**Receiving gifts:**
- Many agencies prohibit accepting gifts
- Even small gifts can create obligation
- Know your agency's policy
- Politely decline or check with supervisor

**Lending or borrowing money:**
- NEVER lend money to clients
- NEVER borrow money from clients
- This crosses professional boundaries

**Being included in wills:**
- Report if a client mentions including you
- This can be seen as exploitation

### Personal Relationships

**Keep conversations appropriate:**
- Share some personal information to build rapport
- Don't overshare your problems
- Don't burden clients with your issues
- Remember: you're there for them

**Avoid dual relationships:**
- Don't become their social friend outside work
- Don't date family members
- Maintain professional distance

### Physical Boundaries

- Only touch as necessary for care
- Respect client modesty
- Knock before entering rooms
- Maintain appropriate physical distance

## Social Media Concerns

**NEVER:**
- Post photos of clients
- Share client information online
- Friend/follow clients or families
- Discuss work with identifying details

**Privacy is paramount.**

## When Boundaries Are Tested

Clients or families may:
- Offer gifts or extra payment
- Ask you to stay longer "off the clock"
- Want to become personal friends
- Share too much personal information
- Ask you to do things outside your role

**How to respond:**
1. Stay calm and professional
2. Politely but firmly maintain the boundary
3. Explain your agency's policies if helpful
4. Redirect the conversation
5. Report persistent issues to your supervisor

## Maintaining Balance

Good care includes warmth and connection, but within limits:
- Be friendly, not a friend
- Be caring, not personally involved
- Be supportive, not a therapist
- Be professional, not cold
        `,
        quiz: [
          {
            question: "A grateful client offers you $100 cash as a thank-you gift. You should:",
            options: [
              "Accept it since they really want you to have it",
              "Politely decline and explain your agency's policy on gifts",
              "Accept it but don't tell anyone",
              "Tell them to give it to you next time instead"
            ],
            correctAnswer: 1,
            explanation: "Most agencies prohibit accepting gifts, especially cash, to prevent any appearance of exploitation. Politely decline and thank them for the thought."
          },
          {
            question: "A client asks to friend you on Facebook. How should you handle this?",
            options: [
              "Accept to be polite",
              "Accept but hide your posts from them",
              "Politely decline and explain you keep work and social media separate",
              "Create a fake account to connect with them"
            ],
            correctAnswer: 2,
            explanation: "Connecting on social media blurs professional boundaries and creates privacy risks. Politely decline while maintaining a warm, professional relationship in person."
          },
          {
            question: "What is the PRIMARY purpose of professional boundaries?",
            options: [
              "To keep caregivers from getting too close to clients",
              "To protect both clients and caregivers and maintain a safe, professional relationship",
              "To make care more efficient",
              "To follow legal requirements only"
            ],
            correctAnswer: 1,
            explanation: "Boundaries protect everyone involved. They prevent exploitation of vulnerable clients, protect caregiver careers, and ensure objective, consistent care."
          }
        ]
      },
      {
        id: "eb-4",
        title: "Navigating Family Dynamics",
        duration: "25 min",
        objectives: [
          "Communicate effectively with family members",
          "Handle disagreements between family members",
          "Maintain focus on the client's wellbeing"
        ],
        topics: ["Family communication", "Conflicting instructions", "Family disagreements", "Maintaining neutrality"],
        content: `
# Navigating Family Dynamics

Working with families can be rewarding but also challenging. Families often have complex dynamics that you may find yourself navigating.

## Your Role with Families

**You are:**
- A member of the care team
- A communicator of important information
- A support to the family
- An advocate for the client

**You are NOT:**
- A family mediator
- A therapist
- A decision-maker for the family
- Required to take sides

## Communicating with Family Members

**Best practices:**
- Be professional and objective
- Share observations, not opinions
- Document communications
- Know who is authorized to receive information
- Respect the client's privacy and wishes

**What to share:**
- Changes in client condition
- Care-related updates
- Concerns about safety or health
- Questions about the care plan

**What NOT to share:**
- Your personal opinions about family members
- Information about other clients
- Gossip or complaints

## When Family Members Disagree

Families often have different ideas about care:
- One child wants mom in a facility; another wants her home
- Disagreements about medical treatments
- Conflicts about who should be involved

**Your approach:**
1. Stay neutral - don't take sides
2. Refer to the care plan and authorized decision-makers
3. Focus on the client's stated wishes and wellbeing
4. Report conflicts to your supervisor

## Handling Conflicting Instructions

**If different family members give you different instructions:**
- Refer to the documented care plan
- Identify who has decision-making authority (usually healthcare power of attorney)
- When in doubt, check with your supervisor
- Document the conflicting requests

**Example:**
Son: "Don't let Mom eat any sugar."
Daughter: "A little dessert is fine, she should enjoy her life."

**Your response:** "I follow the care plan we have in place. Let me check with my supervisor about updating it if needed."

## Keeping the Client Central

Remember:
- The client is your primary focus
- Client's expressed wishes matter
- Don't talk about the client as if they're not there
- Include the client in conversations about their care
- Respect client confidentiality even with family

**When family wishes conflict with client wishes:**
- Document the client's stated preferences
- Communicate concerns to your supervisor
- Advocate for the client appropriately
- Don't override client wishes without proper authority

## Dealing with Difficult Family Members

Some family members may be:
- Critical of your care
- Demanding beyond the care plan
- Absent but opinionated
- Overly controlling

**Strategies:**
- Remain professional and calm
- Listen to their concerns
- Explain your role and limitations
- Refer to your supervisor when needed
- Don't take criticism personally
- Document difficult interactions
        `,
        quiz: [
          {
            question: "Two adult children of your client are arguing about whether their parent should move to assisted living. You should:",
            options: [
              "Share your opinion to help them decide",
              "Take the side of whoever is there more often",
              "Stay neutral, focus on providing care, and let them know this is a family decision",
              "Call a family meeting to mediate"
            ],
            correctAnswer: 2,
            explanation: "Family decisions about care settings are not within your role. Stay neutral, continue providing care, and let them know major decisions are family matters. Report to your supervisor if needed."
          },
          {
            question: "A family member gives you instructions that differ from the care plan. What should you do?",
            options: [
              "Follow the family member's instructions since they know the client best",
              "Follow the documented care plan and suggest they contact the supervisor to update it if needed",
              "Do whatever seems easiest",
              "Ignore both and use your own judgment"
            ],
            correctAnswer: 1,
            explanation: "Always follow the documented care plan. If a family member wants changes, refer them to your supervisor who can officially update the plan through proper channels."
          },
          {
            question: "Your client tells you she doesn't want her son to know about a medical issue, but her son has healthcare power of attorney. How should you handle this?",
            options: [
              "Keep the secret since the client asked",
              "Tell the son immediately since he has POA",
              "Document the client's wishes and discuss with your supervisor about how to handle this sensitively",
              "Pretend you don't know about the medical issue"
            ],
            correctAnswer: 2,
            explanation: "This is a complex situation involving client autonomy and legal authority. Document the client's stated wishes and consult your supervisor for guidance on navigating this appropriately."
          }
        ]
      }
    ]
  },
  "client-communication": {
    id: "client-communication",
    title: "Client Communication",
    description: "Master difficult conversations, cultural sensitivity, and knowing when to escalate concerns.",
    category: "Interpersonal Skills",
    duration: "2.5 hours",
    enrolled: 2012,
    rating: 4.9,
    certificate: true,
    icon: MessageSquare,
    sources: ["NIA", "Cultural Competency Standards", "Best Practices"],
    color: "pink",
    modules: [
      {
        id: "cc-1",
        title: "Building Rapport & Trust",
        duration: "30 min",
        objectives: [
          "Establish trust with new clients",
          "Use active listening techniques",
          "Adapt communication to individual needs"
        ],
        topics: ["First impressions", "Active listening", "Empathy", "Building connections", "Overcoming barriers"],
        content: `
# Building Rapport & Trust

The foundation of good care is a trusting relationship. Clients who trust their caregiver have better outcomes and more positive experiences.

## Why Trust Matters

When clients trust you, they:
- Share important health information
- Accept help more readily
- Experience less anxiety
- Have better quality of life
- Are more cooperative with care

## First Impressions

The first meeting sets the tone for your relationship.

**Do:**
- Arrive on time
- Dress professionally
- Smile and make eye contact
- Introduce yourself clearly
- Learn and use their preferred name
- Show genuine interest in them

**Don't:**
- Rush through introductions
- Start immediately with tasks
- Make assumptions about their abilities
- Talk over them or interrupt

## Active Listening

Active listening means fully concentrating on what's being said.

**Techniques:**
- Give your full attention (put away phone)
- Face the speaker
- Maintain appropriate eye contact
- Nod and use encouraging sounds ("I see," "mm-hmm")
- Don't interrupt
- Ask clarifying questions
- Summarize to confirm understanding

**Example:**
Client: "I used to love gardening, but I can't get down on my knees anymore."
Caregiver: "It sounds like gardening was really important to you. Are there ways we could help you still enjoy plants, like container gardening on a table?"

## Showing Empathy

Empathy is understanding and sharing feelings:

**Empathetic responses:**
- "That must be really frustrating."
- "I can see this is difficult for you."
- "It's understandable to feel that way."

**Avoid:**
- "I know exactly how you feel."
- "At least you have..."
- "You shouldn't feel that way."

## Overcoming Communication Barriers

**Hearing difficulties:**
- Face them when speaking
- Speak clearly (not necessarily louder)
- Reduce background noise
- Be patient with hearing aids

**Vision difficulties:**
- Identify yourself when entering
- Describe what you're doing
- Keep items in consistent places

**Cognitive challenges:**
- Use simple, short sentences
- Give one instruction at a time
- Allow extra time for responses
- Use visual cues when helpful

## Building Connection Over Time

- Remember details about their life
- Ask about things they've mentioned
- Respect their routines and preferences
- Be consistent and reliable
- Admit when you don't know something
- Keep promises
        `,
        quiz: [
          {
            question: "What is the PRIMARY purpose of active listening?",
            options: [
              "To gather information efficiently",
              "To show the speaker they are heard and understood",
              "To prepare your response while they talk",
              "To find problems that need solving"
            ],
            correctAnswer: 1,
            explanation: "Active listening's main purpose is to show the speaker they are truly heard and understood. This builds trust and improves communication."
          },
          {
            question: "Your new client seems nervous and hesitant to accept your help. What's the BEST approach?",
            options: [
              "Just start doing tasks to show how helpful you are",
              "Tell them they need to accept help whether they want it or not",
              "Take time to introduce yourself, listen to their concerns, and go at their pace",
              "Call their family to convince them to cooperate"
            ],
            correctAnswer: 2,
            explanation: "Building trust takes time. Go slowly, listen to their concerns, and let them set the pace. Rushing or forcing help increases resistance."
          },
          {
            question: "A client tells you they miss being able to drive. An empathetic response would be:",
            options: [
              "At least you don't have to pay for gas anymore.",
              "That must be really hard - driving gave you independence.",
              "Everyone loses their license eventually.",
              "You shouldn't be driving at your age anyway."
            ],
            correctAnswer: 1,
            explanation: "An empathetic response acknowledges their feelings and the meaning behind them. Minimizing, comparing, or dismissing feelings damages trust."
          }
        ]
      },
      {
        id: "cc-2",
        title: "Difficult Conversations",
        duration: "40 min",
        objectives: [
          "Navigate sensitive topics with compassion",
          "Respond to grief, anger, and fear appropriately",
          "Maintain boundaries while being supportive"
        ],
        topics: ["Sensitive topics", "Responding to emotions", "End-of-life conversations", "Setting limits kindly"],
        content: `
# Difficult Conversations

As a caregiver, you'll face conversations about sensitive topics. Handling these with compassion and skill is essential.

## Common Difficult Topics

- Loss and grief
- Declining health and abilities
- End-of-life wishes
- Family conflicts
- Refusing care
- Personal hygiene issues
- Safety concerns (driving, living alone)

## Approaching Sensitive Conversations

**Before the conversation:**
- Choose an appropriate time and place
- Allow enough time (don't rush)
- Minimize distractions
- Prepare yourself emotionally

**During the conversation:**
- Use "I" statements ("I've noticed..." not "You're...")
- Be direct but kind
- Allow silence and processing time
- Focus on one issue at a time
- Listen more than you speak

**After the conversation:**
- Follow up as appropriate
- Document if needed
- Seek support if it was difficult for you too

## Responding to Grief

Clients may grieve losses of:
- Loved ones
- Health and abilities
- Independence
- Their former life

**Supportive responses:**
- "I'm so sorry for your loss."
- Simply being present
- "Would you like to tell me about them?"
- Allowing tears and silence

**Avoid:**
- "They're in a better place."
- "You need to move on."
- Changing the subject
- Excessive cheerfulness

## When Clients Are Angry

**Remember:**
- Anger often masks fear, frustration, or pain
- Don't take it personally
- Stay calm

**Response steps:**
1. Stay calm and don't react defensively
2. Acknowledge their feelings: "I can see you're upset."
3. Listen to understand the real issue
4. Validate what you can
5. Problem-solve if appropriate
6. Know when to give space

## When Clients Are Afraid

**Common fears:**
- Losing independence
- Being a burden
- Pain and suffering
- Being alone
- The unknown

**Supportive approaches:**
- Acknowledge the fear
- Don't dismiss or minimize
- Provide reassurance you can honestly give
- Help them feel in control where possible
- Listen without trying to fix

## End-of-Life Conversations

If clients want to talk about death:
- Don't change the subject
- Listen without judgment
- Allow them to express wishes
- Don't impose your beliefs
- Know when to refer to professionals (chaplain, counselor)

**It's okay to say:**
- "That sounds like an important conversation to have with your family."
- "Would you like me to help you find someone to talk to about this?"

## Setting Limits Kindly

Sometimes you need to say no or set limits:
- Requests outside your scope
- Unreasonable demands
- Boundary violations

**Example:**
"I understand you'd like me to stay later, but I need to leave at my scheduled time. Let's make sure we get the most important things done before I go."
        `,
        quiz: [
          {
            question: "A client becomes tearful talking about their deceased spouse. The BEST response is to:",
            options: [
              "Quickly change the subject to cheer them up",
              "Say 'Don't cry, they wouldn't want you to be sad'",
              "Sit with them quietly, offer a tissue, and say 'I'm here if you want to talk'",
              "Tell them a story about when you lost someone"
            ],
            correctAnswer: 2,
            explanation: "Allowing someone to grieve, being present, and offering quiet support is most helpful. Don't rush them, dismiss feelings, or make it about yourself."
          },
          {
            question: "A client is angry and yelling at you about something that isn't your fault. You should:",
            options: [
              "Yell back to defend yourself",
              "Walk out immediately",
              "Stay calm, acknowledge their feelings, and try to understand what's really wrong",
              "Tell them their behavior is unacceptable"
            ],
            correctAnswer: 2,
            explanation: "Staying calm and acknowledging feelings often defuses anger. Anger usually masks other emotions like fear or frustration. Don't take it personally."
          },
          {
            question: "A client says they don't want to 'be a burden' and wishes they would just die. How should you respond?",
            options: [
              "Change the subject to something positive",
              "Tell them not to talk that way",
              "Take it seriously, listen without judgment, and inform your supervisor",
              "Assure them everything will be fine"
            ],
            correctAnswer: 2,
            explanation: "Statements about wanting to die should always be taken seriously. Listen without judgment, and report to your supervisor. This may require professional intervention."
          }
        ]
      },
      {
        id: "cc-3",
        title: "Cultural Sensitivity",
        duration: "35 min",
        objectives: [
          "Recognize how culture influences care preferences",
          "Avoid cultural assumptions and stereotypes",
          "Adapt care to respect cultural differences"
        ],
        topics: ["Cultural awareness", "Food and dietary practices", "Communication styles", "Religious observances", "Avoiding stereotypes"],
        content: `
# Cultural Sensitivity

Every client brings their own cultural background, which influences their preferences, beliefs, and expectations about care.

## What Is Cultural Sensitivity?

Cultural sensitivity means:
- Being aware that cultural differences exist
- Not assuming everyone shares your values
- Respecting practices different from your own
- Adapting care to honor cultural preferences

## Culture Influences...

**Communication:**
- Direct vs. indirect communication styles
- Eye contact norms
- Personal space preferences
- Who speaks for the family
- How emotions are expressed

**Family roles:**
- Who makes decisions
- Who provides care
- Gender roles in caregiving
- Multi-generational households

**Health beliefs:**
- Causes of illness
- Traditional remedies
- Attitudes toward Western medicine
- Views on mental health

**Food:**
- Religious dietary laws
- Traditional foods
- Meal times and customs
- Eating alone vs. with family

**Religion and spirituality:**
- Prayer times and practices
- Religious holidays
- End-of-life rituals
- Modesty requirements

## Avoiding Stereotypes

**Important principles:**
- Culture is not monolithic - individuals vary
- Ask, don't assume
- Learn from each client
- Don't generalize from one person to an entire group

**Instead of assuming, ask:**
- "Are there any dietary preferences or restrictions I should know about?"
- "Are there any cultural or religious practices important to you?"
- "How does your family like to handle decisions about care?"

## Practical Cultural Considerations

### Modesty
Some cultures have strong modesty norms:
- Same-gender caregiver may be preferred
- Cover client appropriately during personal care
- Knock and ask permission before entering
- Be aware of clothing and touching norms

### Food Preparation
- Learn about dietary laws (halal, kosher, vegetarian)
- Ask about food preparation preferences
- Understand that sharing meals may be culturally important

### Communication Styles
- Some cultures value indirect communication
- Silence may be respectful, not awkward
- Family members may need to be involved in discussions

### Religious Observances
- Be aware of major holidays and observances
- Accommodate prayer times when possible
- Respect religious objects in the home

## When Values Seem to Conflict

What if cultural practices conflict with care recommendations?

1. Don't judge or dismiss
2. Try to understand the reasoning
3. Look for compromises
4. Involve cultural or religious leaders if appropriate
5. Report to supervisor if safety is a concern
        `,
        quiz: [
          {
            question: "How should you learn about a new client's cultural preferences?",
            options: [
              "Research their ethnicity online and apply what you learn",
              "Assume they follow typical practices of their cultural group",
              "Ask them directly about their individual preferences and practices",
              "Wait for them to tell you if something is wrong"
            ],
            correctAnswer: 2,
            explanation: "Always ask individuals about their preferences rather than assuming based on their cultural background. People within any culture vary widely in their practices."
          },
          {
            question: "Your client's family wants to be involved in all care decisions, which slows things down. You should:",
            options: [
              "Tell them decisions need to be made faster",
              "Only communicate with one family member",
              "Recognize this may be cultural and find ways to include family while meeting care needs",
              "Report the family for interfering"
            ],
            correctAnswer: 2,
            explanation: "In many cultures, family involvement in care decisions is the norm. Try to accommodate this while still meeting care needs. Communication and flexibility are key."
          },
          {
            question: "A client from a different cultural background does something you find strange or uncomfortable. You should:",
            options: [
              "Tell them that's not how things are done here",
              "Withhold judgment, try to understand, and ask respectful questions if appropriate",
              "Report it to your supervisor as concerning behavior",
              "Ignore it and hope it doesn't happen again"
            ],
            correctAnswer: 1,
            explanation: "Reserve judgment - what seems strange to you may be normal in their culture. Try to understand through respectful curiosity. Only escalate if it involves safety concerns."
          }
        ]
      },
      {
        id: "cc-4",
        title: "When & How to Escalate",
        duration: "25 min",
        objectives: [
          "Identify situations requiring escalation",
          "Communicate concerns effectively to supervisors",
          "Know when to involve emergency services"
        ],
        topics: ["Escalation criteria", "Effective reporting", "Chain of command", "Emergency situations", "Documentation"],
        content: `
# When & How to Escalate

Knowing when to seek help and how to communicate concerns effectively is a crucial caregiver skill. Escalating appropriately can prevent serious problems.

## What Does "Escalate" Mean?

Escalating means bringing a concern to someone with more authority or expertise:
- Your supervisor
- The care coordinator
- Healthcare providers
- Emergency services (911)

## When to Escalate to Your Supervisor

**Always report:**
- Changes in client's condition
- Safety concerns
- Suspected abuse or neglect
- Family conflicts affecting care
- Requests to do things outside your scope
- Client refusing necessary care
- Medication concerns
- Equipment problems
- Schedule conflicts
- Personal safety concerns

**Don't wait:**
- If you're unsure, ask
- If something feels wrong, report it
- Early reporting prevents bigger problems

## When to Call 911

**Call 911 immediately for:**
- Chest pain or difficulty breathing
- Signs of stroke (FAST)
- Serious injury or fall with injury
- Uncontrolled bleeding
- Loss of consciousness
- Severe allergic reaction
- Suicidal statements with intent/plan
- Violent behavior

## How to Report Effectively

**Use SBAR format:**
- **S**ituation: What's happening right now?
- **B**ackground: What's the relevant history?
- **A**ssessment: What have you observed?
- **R**ecommendation: What do you think should happen?

**Example SBAR Report:**
"Hi, this is Maria calling about Mrs. Johnson.

**Situation:** Mrs. Johnson is more confused than usual and can't tell me what day it is.

**Background:** She normally knows the date and has been sharp until today. She took all her regular medications this morning.

**Assessment:** I'm concerned this is a significant change from her baseline. I also noticed she hasn't had much to drink today.

**Recommendation:** I think she should be evaluated by her doctor. Should I call the family and her physician?"

## What to Include When Reporting

- Client name
- Date and time of observation
- Specific, objective facts (what you saw, heard)
- Duration and progression
- Any immediate actions you took
- Your name and contact information

## Documentation

Document:
- What you observed
- Who you reported to
- When you reported
- What response/instructions you received
- Actions taken

**Remember:**
- If it wasn't documented, it didn't happen
- Write objectively
- Be specific
- Document as soon as possible

## Following Up

After escalating:
- Follow any instructions given
- Continue monitoring
- Report any changes
- Ensure the loop is closed
- Don't assume someone else handled it
        `,
        quiz: [
          {
            question: "You notice your client seems more confused than usual but nothing emergency-level. You should:",
            options: [
              "Wait to see if it gets worse before saying anything",
              "Document the change and report to your supervisor today",
              "Only mention it at your next scheduled check-in",
              "Give the client coffee to perk them up"
            ],
            correctAnswer: 1,
            explanation: "Changes in mental status should always be reported promptly, even if not emergency-level. Document what you observed and report to your supervisor. Early intervention can prevent serious problems."
          },
          {
            question: "What does the 'A' in SBAR stand for?",
            options: ["Action", "Assessment", "Alert", "Advice"],
            correctAnswer: 1,
            explanation: "SBAR stands for Situation, Background, Assessment, and Recommendation. Assessment is your objective observations about what's happening."
          },
          {
            question: "You reported a concern to your supervisor yesterday but haven't heard back and the situation hasn't improved. You should:",
            options: [
              "Wait patiently - they must be busy",
              "Assume they're handling it since you reported it",
              "Follow up again to ensure the issue is being addressed",
              "Stop worrying since you did your part"
            ],
            correctAnswer: 2,
            explanation: "Don't assume someone else handled it. Follow up to ensure your concern is being addressed. Professional persistence protects your client."
          }
        ]
      }
    ]
  }
};

// Default course data for courses not yet fully defined
const defaultCourse = {
  id: "default",
  title: "Course Coming Soon",
  description: "This course content is being developed.",
  category: "Training",
  duration: "TBD",
  enrolled: 0,
  rating: 0,
  certificate: false,
  icon: BookOpen,
  sources: [],
  color: "gray",
  modules: []
};

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const course = coursesData[courseId] || defaultCourse;

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const currentModule = course.modules[currentModuleIndex];
  const Icon = course.icon;

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
      purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" },
      green: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", border: "border-green-200 dark:border-green-800" },
      amber: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
      pink: { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-700 dark:text-pink-400", border: "border-pink-200 dark:border-pink-800" },
      gray: { bg: "bg-gray-100 dark:bg-gray-900/30", text: "text-gray-700 dark:text-gray-400", border: "border-gray-200 dark:border-gray-800" },
    };
    return colors[color] || colors.blue;
  };

  const colors = getColorClasses(course.color);

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const allCorrect = currentModule?.quiz?.every((q, i) => quizAnswers[i] === q.correctAnswer);
    if (allCorrect && currentModule) {
      setCompletedModules([...completedModules, currentModule.id]);
    }
  };

  const handleNextModule = () => {
    if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setShowQuiz(false);
      setQuizAnswers({});
      setQuizSubmitted(false);
    }
  };

  const handlePreviousModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      setShowQuiz(false);
      setQuizAnswers({});
      setQuizSubmitted(false);
    }
  };

  const progress = course.modules.length > 0
    ? Math.round((completedModules.length / course.modules.length) * 100)
    : 0;

  if (course.modules.length === 0) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8">
          <BackButton href="/training" label="Back to Training" />
          <Card className="mt-6">
            <CardContent className="py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-xl">{course.title}</h3>
              <p className="text-muted-foreground mt-2">
                This course content is currently being developed. Check back soon!
              </p>
              <Link href="/training">
                <Button className="mt-6">Browse Available Courses</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <BackButton href="/training" label="Back to Training" />

        {/* Course Header */}
        <div className={`mt-6 rounded-xl ${colors.bg} p-6`}>
          <div className="flex items-start gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-lg bg-white/50 ${colors.text}`}>
              <Icon className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary">{course.category}</Badge>
                {course.certificate && (
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                    <Award className="mr-1 h-3 w-3" />
                    Certificate
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
              <p className="text-muted-foreground mt-1">{course.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {course.modules.length} modules
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {course.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.enrolled.toLocaleString()} enrolled
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Course Progress</span>
              <span>{progress}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mt-6">
          {/* Module Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Modules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.modules.map((module, index) => {
                  const isCompleted = completedModules.includes(module.id);
                  const isCurrent = index === currentModuleIndex;
                  return (
                    <button
                      key={module.id}
                      onClick={() => {
                        setCurrentModuleIndex(index);
                        setShowQuiz(false);
                        setQuizAnswers({});
                        setQuizSubmitted(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        isCurrent
                          ? `${colors.bg} ${colors.text}`
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        isCompleted
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : isCurrent
                          ? `${colors.bg} ${colors.text}`
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isCurrent ? colors.text : ''}`}>
                          {module.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{module.duration}</p>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Module Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Module {currentModuleIndex + 1} of {course.modules.length}
                    </Badge>
                    <CardTitle>{currentModule.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4" />
                      {currentModule.duration}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!showQuiz ? (
                  <>
                    {/* Learning Objectives */}
                    <div className={`rounded-lg ${colors.bg} p-4 mb-6`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className={`h-5 w-5 ${colors.text}`} />
                        <h3 className={`font-semibold ${colors.text}`}>Learning Objectives</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        After completing this module, you will be able to:
                      </p>
                      <ul className="space-y-1">
                        {currentModule.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className={`h-4 w-4 mt-0.5 ${colors.text}`} />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Module Content */}
                    <div className="prose dark:prose-invert max-w-none mb-6">
                      {currentModule.content.split('\n').map((line, i) => {
                        if (line.startsWith('# ')) {
                          return <h1 key={i} className="text-2xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
                        } else if (line.startsWith('## ')) {
                          return <h2 key={i} className="text-xl font-semibold mt-5 mb-3">{line.substring(3)}</h2>;
                        } else if (line.startsWith('### ')) {
                          return <h3 key={i} className="text-lg font-medium mt-4 mb-2">{line.substring(4)}</h3>;
                        } else if (line.startsWith('- **')) {
                          const match = line.match(/- \*\*(.+?)\*\*:? ?(.*)/);
                          if (match) {
                            return (
                              <div key={i} className="flex items-start gap-2 my-1">
                                <span className="text-primary">•</span>
                                <span><strong>{match[1]}</strong>: {match[2]}</span>
                              </div>
                            );
                          }
                        } else if (line.startsWith('- ')) {
                          return (
                            <div key={i} className="flex items-start gap-2 my-1">
                              <span className="text-primary">•</span>
                              <span>{line.substring(2)}</span>
                            </div>
                          );
                        } else if (line.match(/^\d+\. /)) {
                          return (
                            <div key={i} className="flex items-start gap-2 my-1">
                              <span className="font-medium text-primary">{line.match(/^\d+/)![0]}.</span>
                              <span>{line.replace(/^\d+\. /, '')}</span>
                            </div>
                          );
                        } else if (line.startsWith('**') && line.endsWith('**')) {
                          return <p key={i} className="font-semibold my-2">{line.replace(/\*\*/g, '')}</p>;
                        } else if (line.trim()) {
                          return <p key={i} className="my-2">{line}</p>;
                        }
                        return null;
                      })}
                    </div>

                    {/* Topics Covered */}
                    <div className="border rounded-lg p-4 mb-6">
                      <h3 className="font-semibold mb-2">Topics Covered</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentModule.topics.map((topic, i) => (
                          <Badge key={i} variant="outline">{topic}</Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => setShowQuiz(true)}>
                      Take Module Quiz
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Quiz Section */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className={`h-5 w-5 ${colors.text}`} />
                        <h3 className="font-semibold text-lg">Knowledge Check</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">
                        Answer the following questions to complete this module.
                      </p>

                      <div className="space-y-6">
                        {currentModule.quiz.map((question, qIndex) => (
                          <div key={qIndex} className="border rounded-lg p-4">
                            <p className="font-medium mb-3">
                              {qIndex + 1}. {question.question}
                            </p>
                            <RadioGroup
                              value={quizAnswers[qIndex]?.toString()}
                              onValueChange={(value) =>
                                setQuizAnswers({ ...quizAnswers, [qIndex]: parseInt(value) })
                              }
                              disabled={quizSubmitted}
                            >
                              {question.options.map((option, oIndex) => {
                                const isCorrect = oIndex === question.correctAnswer;
                                const isSelected = quizAnswers[qIndex] === oIndex;
                                let optionStyle = "";

                                if (quizSubmitted) {
                                  if (isCorrect) {
                                    optionStyle = "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
                                  } else if (isSelected && !isCorrect) {
                                    optionStyle = "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
                                  }
                                }

                                return (
                                  <div key={oIndex} className={`flex items-center space-x-2 p-2 rounded-lg border ${optionStyle}`}>
                                    <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                                    <Label htmlFor={`q${qIndex}-o${oIndex}`} className="flex-1 cursor-pointer">
                                      {option}
                                    </Label>
                                    {quizSubmitted && isCorrect && (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    )}
                                    {quizSubmitted && isSelected && !isCorrect && (
                                      <AlertCircle className="h-4 w-4 text-red-600" />
                                    )}
                                  </div>
                                );
                              })}
                            </RadioGroup>
                            {quizSubmitted && (
                              <div className={`mt-3 p-3 rounded-lg ${
                                quizAnswers[qIndex] === question.correctAnswer
                                  ? 'bg-green-50 dark:bg-green-900/20'
                                  : 'bg-amber-50 dark:bg-amber-900/20'
                              }`}>
                                <p className="text-sm">
                                  <strong>Explanation:</strong> {question.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {!quizSubmitted ? (
                        <Button
                          className="w-full mt-6"
                          onClick={handleQuizSubmit}
                          disabled={Object.keys(quizAnswers).length < currentModule.quiz.length}
                        >
                          Submit Answers
                        </Button>
                      ) : (
                        <div className="mt-6 space-y-4">
                          {currentModule.quiz.every((q, i) => quizAnswers[i] === q.correctAnswer) ? (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                              <CheckCircle className="h-8 w-8 mx-auto text-green-600 dark:text-green-400" />
                              <p className="font-semibold mt-2 text-green-800 dark:text-green-300">Module Completed!</p>
                              <p className="text-sm text-green-700 dark:text-green-400">
                                Great job! You've successfully completed this module.
                              </p>
                            </div>
                          ) : (
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-center">
                              <AlertCircle className="h-8 w-8 mx-auto text-amber-600 dark:text-amber-400" />
                              <p className="font-semibold mt-2 text-amber-800 dark:text-amber-300">Review Needed</p>
                              <p className="text-sm text-amber-700 dark:text-amber-400">
                                Review the explanations above and try again.
                              </p>
                              <Button
                                variant="outline"
                                className="mt-3"
                                onClick={() => {
                                  setQuizAnswers({});
                                  setQuizSubmitted(false);
                                }}
                              >
                                Retry Quiz
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Separator className="my-6" />

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePreviousModule}
                    disabled={currentModuleIndex === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  {currentModuleIndex < course.modules.length - 1 ? (
                    <Button onClick={handleNextModule}>
                      Next Module
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => router.push('/training')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Award className="mr-2 h-4 w-4" />
                      Complete Course
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
