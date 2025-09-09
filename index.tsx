/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Part, Type } from "@google/genai";

// -------------------------------------------------------------------------
// ⚠️ تحذير أمان خطير جداً - اقرأ بعناية ⚠️
//
// لا ترفع هذا الكود على استضافة عامة والمفتاح موجود بداخله.
// أي شخص يزور موقعك يمكنه سرقة هذا المفتاح واستخدامه على حسابك،
// مما قد يؤدي إلى تكاليف مالية كبيرة.
//
// هذا الحل مخصص فقط للاختبار المؤقت مع مجموعة صغيرة وموثوقة من الأصدقاء.
// بمجرد الانتهاء من الاختبار، يجب عليك حذف الموقع فوراً.
//
// -------------------------------------------------------------------------
const apiKey = "هنا_ضع_مفتاح_GEMINI_API_الخاص_بك"; // <--- ضع مفتاحك هنا

if (apiKey === "هنا_ضع_مفتاح_GEMINI_API_الخاص_بك") {
    alert("الرجاء وضع مفتاح Gemini API الصحيح في ملف index.tsx قبل تشغيل التطبيق.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });


// --- i18n ---
const translations = {
    ar: {
        appTitle: "باندا جيم",
        workout: "التمرينة",
        aiPlanner: "خطط AI",
        nutrition: "التغذية",
        history: "الأرشيف",
        settings: "الإعدادات",
        aiCoach: "كابتن AI",
        toggleTheme: "غير الثيم",
        aiPlannerTitle: "خطط AI",
        aiPlannerDescription: "دخل بياناتك والذكاء الاصطناعي هيعملك خطة تمرين أسبوعية مخصوصة ليك ويشرحهالك.",
        age: "سنك",
        agePlaceholder: "مثال: ٢٥",
        weight: "وزنك (كجم)",
        weightPlaceholder: "مثال: ٧٥",
        height: "طولك (سم)",
        heightPlaceholder: "مثال: ١٨٠",
        goal: "هدفك الأساسي",
        goal_build_muscle: "بناء عضلات",
        goal_lose_weight: "خسارة وزن",
        goal_general_fitness: "لياقة عامة",
        experience: "مستواك",
        experience_beginner: "لسه ببدأ",
        experience_intermediate: "متوسط",
        experience_advanced: "محترف",
        equipment: "الأجهزة المتاحة",
        equipment_full_gym: "جيم كامل",
        equipment_home_weights: "أوزان في البيت",
        equipment_no_equipment: "مفيش أجهزة",
        generatePlan: "اعملي الخطة",
        generatingPlan: "الذكاء الاصطناعي بيجهز خطتك",
        errorProfile: "لو سمحت دخل كل بياناتك عشان نعمل الخطة.",
        errorGenerate: "حصل مشكلة واحنا بنعمل الخطة. جرب تاني لو سمحت.",
        whyThisPlan: "اشمعنى الخطة دي؟",
        closeExplanation: "قفل الشرح",
        todayWorkout: "تمرين النهاردة",
        noExercises: "مفيش تمارين النهاردة.",
        addOrGenerate: "ضيف تمرين جديد أو اعمل خطة بالذكاء الاصطناعي.",
        addExercise: "ضيف تمرين",
        finishWorkout: "خلصت تمرين",
        edit: "تعديل",
        delete: "مسح",
        watchVideo: "شوف فيديو التمرين",
        historyTitle: "أرشيف التمارين",
        noHistory: "لسه مفيش حاجة في الأرشيف.",
        completeWorkoutPrompt: "خلص تمرين عشان نضيفه هنا.",
        addExerciseTitle: "إضافة تمرين جديد",
        editExerciseTitle: "تعديل التمرين",
        exerciseName: "اسم التمرين",
        sets: "مجموعات",
        reps: "عدات",
        videoUrl: "لينك فيديو (اختياري)",
        videoUrlPlaceholder: "https://www.youtube.com/watch?v=...",
        cancel: "إلغاء",
        saveChanges: "حفظ",
        add: "إضافة",
        invalidVideo: "اللينك ده مش شغال.",
        closeVideo: "اقفل الفيديو",
        customWorkout: "تمرين مخصص",
        settingsTitle: "الإعدادات",
        display: "العرض",
        language: "اللغة",
        theme: "الثيم",
        light: "فاتح",
        dark: "غامق",
        font: "الخط",
        fontFamily: "نوع الخط",
        fontSize: "حجم الخط",
        restTime: "وقت الراحة (بالثواني)",
        restTimeSeconds: " ثانية راحة",
        resting: "راحة",
        askQuestionPlaceholder: "اسأل أي حاجة عن الجيم والتمرين...",
        send: "ابعت",
        totalSetsLabel: "إجمالي المجموعات",
        estDurationLabel: "الوقت تقريبا",
        achievements: "الإنجازات",
        achievement_first_workout_title: "أول خطوة",
        achievement_first_workout_desc: "خلصت أول تمرينة ليك",
        achievement_consistency_7_days_title: "عاش يا ملتزم",
        achievement_consistency_7_days_desc: "كملت ٧ أيام تمرين",
        achievement_total_sets_100_title: "يا وحش",
        achievement_total_sets_100_desc: "كملت ١٠٠ مجموعة",
        achievement_ten_exercises_title: "مستكشف الجيم",
        achievement_ten_exercises_desc: "جربت ١٠ تمارين مختلفة",
        achievementUnlocked: "إنجاز جديد يا بطل!",
        nutritionTitle: "كابتن التغذية AI",
        nutritionDescription: "اطلب من الذكاء الاصطناعي يعملك خطط أكل صحية أو يديك أفكار لوجبات معينة.",
        nutritionPlaceholder: "مثال: خطة أكل ليوم كامل ٢٠٠٠ سعر حراري",
        generateMealPlan: "اعملي خطة أكل",
        generatingMealPlan: "الذكاء الاصطناعي بيجهزلك أكلك...",
        ingredients: "المكونات",
        instructions: "طريقة التحضير",
        errorNutrition: "حصل مشكلة واحنا بنعمل خطة الأكل.",
        personalRecords: "أرقامك القياسية",
        noPRs: "لسه مسجلتش أوزان.",
        trackWeightsPrompt: "سجل الأوزان في تمارينك عشان تتابع أرقامك القياسية.",
        explainExercise: "اشرحلي التمرين",
        loadingExplanation: "ثواني، الذكاء الاصطناعي بيشرح التمرين...",
        exerciseInfo: "معلومات عن التمرين",
        description: "الوصف",
        musclesTargeted: "العضلات اللي بتستهدفها",
        formTips: "نصايح عشان تلعب صح",
        close: "قفل",
        kg: "كجم",
        attachImage: "إرفاق صورة",
        animations: "الرسوم المتحركة",
        enabled: "تفعيل",
        disabled: "إيقاف",
    },
    en: {
        appTitle: "Panda Gym",
        workout: "Workout",
        aiPlanner: "AI Planner",
        nutrition: "Nutrition",
        history: "History",
        settings: "Settings",
        aiCoach: "AI Coach",
        toggleTheme: "Toggle theme",
        aiPlannerTitle: "AI Planner",
        aiPlannerDescription: "Enter your details and the AI will generate and explain a personalized weekly workout plan for you.",
        age: "Age",
        agePlaceholder: "e.g., 25",
        weight: "Weight (kg)",
        weightPlaceholder: "e.g., 75",
        height: "Height (cm)",
        heightPlaceholder: "e.g., 180",
        goal: "Primary Goal",
        goal_build_muscle: "Build Muscle",
        goal_lose_weight: "Lose Weight",
        goal_general_fitness: "General Fitness",
        experience: "Experience Level",
        experience_beginner: "Beginner",
        experience_intermediate: "Intermediate",
        experience_advanced: "Advanced",
        equipment: "Available Equipment",
        equipment_full_gym: "Full Gym",
        equipment_home_weights: "Home Weights",
        equipment_no_equipment: "No Equipment",
        generatePlan: "Generate My Plan",
        generatingPlan: "AI is preparing your plan",
        errorProfile: "Please enter all your details to generate a plan.",
        errorGenerate: "An error occurred while generating the plan. Please try again.",
        whyThisPlan: "Why This Plan?",
        closeExplanation: "Close explanation",
        todayWorkout: "Today's Workout",
        noExercises: "No exercises for today.",
        addOrGenerate: "Add a new exercise or create a plan with the AI planner.",
        addExercise: "Add Exercise",
        finishWorkout: "Finish Workout",
        edit: "Edit",
        delete: "Delete",
        watchVideo: "Watch exercise video",
        historyTitle: "Workout History",
        noHistory: "No history yet.",
        completeWorkoutPrompt: "Complete a workout to add it here.",
        addExerciseTitle: "Add New Exercise",
        editExerciseTitle: "Edit Exercise",
        exerciseName: "Exercise Name",
        sets: "Sets",
        reps: "Reps",
        videoUrl: "Video URL (optional)",
        videoUrlPlaceholder: "https://www.youtube.com/watch?v=...",
        cancel: "Cancel",
        saveChanges: "Save Changes",
        add: "Add",
        invalidVideo: "Invalid video link.",
        closeVideo: "Close video player",
        customWorkout: "Custom Workout",
        settingsTitle: "Settings",
        display: "Display",
        language: "Language",
        theme: "Theme",
        light: "Light",
        dark: "Dark",
        font: "Font",
        fontFamily: "Font Family",
        fontSize: "Font Size",
        restTime: "Rest Time (seconds)",
        restTimeSeconds: "s rest",
        resting: "Rest",
        askQuestionPlaceholder: "Ask anything about fitness...",
        send: "Send",
        totalSetsLabel: "Total Sets",
        estDurationLabel: "Est. Duration",
        achievements: "Achievements",
        achievement_first_workout_title: "First Step",
        achievement_first_workout_desc: "Complete your first workout",
        achievement_consistency_7_days_title: "Consistent",
        achievement_consistency_7_days_desc: "Complete 7 workout days",
        achievement_total_sets_100_title: "Lifter",
        achievement_total_sets_100_desc: "Complete 100 sets",
        achievement_ten_exercises_title: "Explorer",
        achievement_ten_exercises_desc: "Try 10 different exercises",
        achievementUnlocked: "Achievement Unlocked!",
        nutritionTitle: "AI Nutrition Coach",
        nutritionDescription: "Ask the AI to generate healthy meal plans or ideas for specific meals.",
        nutritionPlaceholder: "e.g., a full day meal plan for 2000 calories",
        generateMealPlan: "Generate Meal Plan",
        generatingMealPlan: "AI is preparing your meals...",
        ingredients: "Ingredients",
        instructions: "Instructions",
        errorNutrition: "An error occurred while generating the meal plan.",
        personalRecords: "Personal Records",
        noPRs: "No weights tracked yet.",
        trackWeightsPrompt: "Log the weights in your exercises to track your personal records.",
        explainExercise: "Explain Exercise",
        loadingExplanation: "AI is explaining the exercise...",
        exerciseInfo: "Exercise Information",
        description: "Description",
        musclesTargeted: "Muscles Targeted",
        formTips: "Proper Form Tips",
        close: "Close",
        kg: "kg",
        attachImage: "Attach Image",
        animations: "Animations",
        enabled: "Enabled",
        disabled: "Disabled",
    }
};

type TranslationKey = keyof typeof translations.ar;
type Language = 'ar' | 'en';
type TFunction = (key: TranslationKey | `${'goal' | 'experience' | 'equipment'}_${string}` | `achievement_${string}_${'title' | 'desc'}`) => string;
type Theme = 'light' | 'dark';
type View = 'workout' | 'ai' | 'history' | 'settings' | 'coach' | 'nutrition';

// --- Interfaces ---
interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  completed: boolean;
  videoUrl?: string;
  restTime?: number;
  weight?: number;
}

interface WorkoutDay {
  day: string;
  exercises: Exercise[];
}

interface UserProfile {
  age: string;
  weight: string;
  height: string;
  goal: 'build_muscle' | 'lose_weight' | 'general_fitness';
  experience: 'beginner' | 'intermediate' | 'advanced';
  equipment: 'full_gym' | 'home_weights' | 'no_equipment';
}

interface HistoryItem {
    date: string;
    workoutName: string;
    exercises: Exercise[];
}

interface ChatMessage {
    role: 'user' | 'model';
    parts: Part[];
}

interface Meal {
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
}
type NutritionPlan = Meal[];

type AchievementId = 'first_workout' | 'consistency_7_days' | 'total_sets_100' | 'ten_exercises';
interface Achievement {
    id: AchievementId;
    icon: string;
    criteria: (history: HistoryItem[]) => boolean;
}

interface ExerciseInfo {
    description: string;
    muscles: string;
    tips: string[];
}


const allAchievements: Record<AchievementId, Achievement> = {
    'first_workout': {
        id: 'first_workout',
        icon: 'fa-solid fa-shoe-prints',
        criteria: (history) => history.length >= 1,
    },
    'consistency_7_days': {
        id: 'consistency_7_days',
        icon: 'fa-solid fa-calendar-check',
        criteria: (history) => history.length >= 7,
    },
    'total_sets_100': {
        id: 'total_sets_100',
        icon: 'fa-solid fa-medal',
        criteria: (history) => history.reduce((total, item) => total + item.exercises.reduce((subTotal, ex) => subTotal + (ex.completed ? ex.sets : 0), 0), 0) >= 100,
    },
    'ten_exercises': {
        id: 'ten_exercises',
        icon: 'fa-solid fa-compass',
        criteria: (history) => {
            const uniqueExercises = new Set();
            history.forEach(item => item.exercises.forEach(ex => uniqueExercises.add(ex.name)));
            return uniqueExercises.size >= 10;
        },
    },
};

// --- Helper Hook ---
const usePersistentState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};

// --- App Component ---
const App: React.FC = () => {
    const [theme, setTheme] = usePersistentState<Theme>('theme', 'dark');
    const [language, setLanguage] = usePersistentState<Language>('language', 'ar');
    const [fontFamily, setFontFamily] = usePersistentState<string>('fontFamily', "'Cairo', sans-serif");
    const [fontSizeMultiplier, setFontSizeMultiplier] = usePersistentState<number>('fontSizeMultiplier', 0.8);
    const [animationsEnabled, setAnimationsEnabled] = usePersistentState<boolean>('animationsEnabled', true);
    const [activeView, setActiveView] = useState<View>('workout');
    const [previousView, setPreviousView] = useState<View>('workout');
    const [userProfile, setUserProfile] = usePersistentState<UserProfile>('userProfile', { age: '', weight: '', height: '', goal: 'build_muscle', experience: 'beginner', equipment: 'full_gym' });
    const [workoutPlan, setWorkoutPlan] = usePersistentState<WorkoutDay[]>('workoutPlan', []);
    const [currentDayIndex, setCurrentDayIndex] = usePersistentState<number>('currentDayIndex', 0);
    const [history, setHistory] = usePersistentState<HistoryItem[]>('history', []);
    const [aiReasoning, setAiReasoning] = usePersistentState<string | null>('aiReasoning', null);
    const [chatHistory, setChatHistory] = usePersistentState<ChatMessage[]>('chatHistory', []);
    const [nutritionPlan, setNutritionPlan] = usePersistentState<NutritionPlan | null>('nutritionPlan', null);
    const [unlockedAchievements, setUnlockedAchievements] = usePersistentState<AchievementId[]>('unlockedAchievements', []);
    const [showAchievementToast, setShowAchievementToast] = useState<Achievement | null>(null);
    
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCoachLoading, setIsCoachLoading] = useState(false);
    const [isNutritionLoading, setIsNutritionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nutritionError, setNutritionError] = useState<string | null>(null);
    
    const [exerciseInfo, setExerciseInfo] = useState<{name: string, content: ExerciseInfo | null}>({name: '', content: null});
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isInfoLoading, setIsInfoLoading] = useState(false);


    const t: TFunction = (key) => translations[language][key as TranslationKey] || translations.en[key as TranslationKey] || key;

    const checkAndUnlockAchievements = (currentHistory: HistoryItem[]) => {
        Object.values(allAchievements).forEach(achievement => {
            if (!unlockedAchievements.includes(achievement.id) && achievement.criteria(currentHistory)) {
                setUnlockedAchievements(prev => [...prev, achievement.id]);
                setShowAchievementToast(achievement);
            }
        });
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
    
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    useEffect(() => {
        document.documentElement.style.setProperty('--font-family', fontFamily);
    }, [fontFamily]);

    useEffect(() => {
        document.documentElement.style.setProperty('--font-size-multiplier', String(fontSizeMultiplier));
    }, [fontSizeMultiplier]);

    useEffect(() => {
        if (animationsEnabled) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }
    }, [animationsEnabled]);
    
    useEffect(() => {
        // Check achievements on initial load
        checkAndUnlockAchievements(history);
    }, []);

    const handleToggleSettings = () => {
        if (activeView === 'settings') {
            setActiveView(previousView);
        } else {
            setPreviousView(activeView);
            setActiveView('settings');
        }
    };

    const handleGeneratePlan = async () => {
        if (!userProfile.age || !userProfile.weight || !userProfile.height) {
            setError(t('errorProfile'));
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const systemPrompt = language === 'ar'
                ? `أنت كابتن جيم مصري محترف وجاد. مهمتك عمل خطة تمرين دقيقة ومختصرة لمدة 7 أيام (اليوم السابع راحة). لكل تمرين، يجب توفير لينك فيديو يوتيوب تعليمي قصير وصحيح، ووقت راحة بالثواني.`
                : `You are a serious, professional Egyptian gym captain. Your task is to create a precise and concise 7-day workout plan (day 7 is rest). For each exercise, provide a short, valid instructional YouTube video link and a rest time in seconds.`;
            
            const userPrompt = language === 'ar'
                ? `اعمل خطة لشخص عمره ${userProfile.age} سنة، ووزنه ${userProfile.weight} كجم، وطوله ${userProfile.height} سم. هدفه الأساسي هو "${t(`goal_${userProfile.goal}`)}"، ومستواه هو "${t(`experience_${userProfile.experience}`)}"، والأجهزة المتاحة عنده هي "${t(`equipment_${userProfile.equipment}`)}". اشرح سبب اختيار هذه الخطة في جملة واحدة قوية ومباشرة.`
                : `Generate the plan for a person who is ${userProfile.age} years old, weighs ${userProfile.weight} kg, and is ${userProfile.height} cm tall. Their primary goal is "${t(`goal_${userProfile.goal}`)}", their experience level is "${t(`experience_${userProfile.experience}`)}", and they have access to "${t(`equipment_${userProfile.equipment}`)}". Explain the plan's logic in one strong, direct sentence.`;

            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    plan: {
                        type: Type.ARRAY,
                        description: "The 7-day workout plan. Day 7 should be rest.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                day: { type: Type.STRING },
                                exercises: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            name: { type: Type.STRING },
                                            sets: { type: Type.INTEGER },
                                            reps: { type: Type.STRING },
                                            videoUrl: { type: Type.STRING },
                                            restTime: { type: Type.INTEGER },
                                        },
                                        required: ['name', 'sets', 'reps', 'videoUrl', 'restTime']
                                    }
                                }
                            },
                             required: ['day', 'exercises']
                        }
                    },
                    reasoning: {
                        type: Type.STRING,
                        description: "A single, strong sentence explaining the logic behind this plan."
                    }
                },
                 required: ['plan', 'reasoning']
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userPrompt,
                config: {
                    systemInstruction: systemPrompt,
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                },
            });

            const jsonResponse = JSON.parse(response.text);

            const newPlan = jsonResponse.plan.map((day: any) => ({
                ...day,
                exercises: day.exercises.map((ex: any) => ({ ...ex, id: crypto.randomUUID(), completed: false }))
            }));

            setWorkoutPlan(newPlan);
            setAiReasoning(jsonResponse.reasoning);
            setCurrentDayIndex(0);
            setActiveView('workout');
        } catch (err) {
            console.error("Error generating plan:", err);
            setError(t('errorGenerate'));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGenerateNutritionPlan = async (query: string) => {
        setIsNutritionLoading(true);
        setNutritionError(null);
        try {
            const systemPrompt = language === 'ar'
                ? `أنت كابتن تغذية مصري محترف. مهمتك عمل خطة وجبات بناءً على طلب المستخدم. لا للكلام الزائد.`
                : `You are a professional Egyptian nutrition captain. Your task is to create a meal plan based on the user's request. No extra talk.`;
            
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    meals: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "اسم الوجبة" },
                                description: { type: Type.STRING, description: "وصف مختصر ومباشر" },
                                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                                instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                            },
                             required: ['name', 'description', 'ingredients', 'instructions']
                        }
                    }
                },
                required: ['meals']
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: query,
                config: {
                    systemInstruction: systemPrompt,
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                },
            });

            const jsonResponse = JSON.parse(response.text);
            setNutritionPlan(jsonResponse.meals);

        } catch (err) {
            console.error("Error generating nutrition plan:", err);
            setNutritionError(t('errorNutrition'));
        } finally {
            setIsNutritionLoading(false);
        }
    };
    
    const handleSendMessageToCoach = async (message: string, image?: { mimeType: string, data: string }) => {
        setIsCoachLoading(true);
    
        const userParts: Part[] = [];
        if (message.trim()) {
            userParts.push({ text: message });
        }
        if (image) {
            userParts.push({ inlineData: { mimeType: image.mimeType, data: image.data } });
        }
    
        const newUserMessage: ChatMessage = { role: 'user', parts: userParts };
        const currentChatHistory = [...chatHistory, newUserMessage];
        setChatHistory(currentChatHistory);
        
        // Add a placeholder for the model's response for streaming
        setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);
    
        try {
            const systemInstruction = "أنت كابتن جيم مصري محترف، شخصيتك حاسمة وجادة جداً. كلامك قليل، مباشر، وقوي. لا مجال للمزاح أو الكلام الجانبي. مهمتك الوحيدة هي الإجابة على الأسئلة المتعلقة بالجيم، التمرينات، التغذية، واللياقة البدنية فقط. إذا سألك المستخدم أي سؤال خارج هذا النطاق، رد عليه بجدية وحزم، وحذره من الخروج عن الموضوع مرة ثانية لتجنب المشاكل، وأمره بالتركيز في هدفه. لا تجب إطلاقاً على سؤاله الخارج عن الموضوع. إذا كرر المستخدم الخروج عن الموضوع، يجب أن تبدأ ردك بـ 'خخخخخخ' متبوعًا بتحذير أشد لهجة. في أول رد لك على الإطلاق، وضح أنك مساعد ذكي وأن كلامك ليس بديلاً عن استشارة متخصص. خاطب المستخدم دائماً بـ 'يا كابتن'.";
            
            const responseStream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: currentChatHistory,
                config: {
                    systemInstruction: systemInstruction,
                },
            });
            
            let responseText = '';
            for await (const chunk of responseStream) {
                if (chunk.text) {
                    responseText += chunk.text;
                    setChatHistory(prev => {
                        const newHistory = [...prev];
                        const lastMessage = newHistory[newHistory.length - 1];
                        if (lastMessage && lastMessage.role === 'model' && lastMessage.parts[0] && 'text' in lastMessage.parts[0]) {
                            lastMessage.parts[0].text = responseText;
                        }
                        return newHistory;
                    });
                }
            }
    
        } catch (err) {
            console.error("Error sending message:", err);
            setChatHistory(prev => [...prev.slice(0, -1), { role: 'model', parts: [{ text: "معلش يا كابتن، عندي مشكلة في الاتصال دلوقتي." }] }]);
        } finally {
            setIsCoachLoading(false);
        }
    };
    
    const handleExplainExercise = async (exerciseName: string) => {
        setExerciseInfo({ name: exerciseName, content: null });
        setIsInfoModalOpen(true);
        setIsInfoLoading(true);
        try {
            const systemPrompt = language === 'ar'
                ? `أنت كابتن جيم مصري محترف. اشرح التمرين المطلوب بشكل مباشر ومختصر.`
                : `You are a professional Egyptian gym captain. Explain the requested exercise directly and concisely.`;
            
            const userPrompt = language === 'ar' ? `اشرحلي تمرين '${exerciseName}' باختصار وباللهجة المصرية.` : `Explain the exercise '${exerciseName}' briefly.`;
    
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING, description: "وصف موجز للحركة" },
                    muscles: { type: Type.STRING, description: "العضلات المستهدفة" },
                    tips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 نصائح أساسية للأداء الصحيح" }
                },
                required: ['description', 'muscles', 'tips']
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userPrompt,
                config: {
                    systemInstruction: systemPrompt,
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                },
            });
            
            const jsonResponse = JSON.parse(response.text);
            setExerciseInfo({ name: exerciseName, content: jsonResponse });
        } catch (err) {
            console.error("Error explaining exercise:", err);
            // In case of error, show a simpler message in the modal
            setExerciseInfo({ name: exerciseName, content: { description: "مش قادر أحمل الشرح دلوقتي.", muscles: "", tips: [] } });
        } finally {
            setIsInfoLoading(false);
        }
    };


    const handleToggleExercise = (id: string) => {
      setWorkoutPlan(prevPlan => {
        const newPlan = [...prevPlan];
        if (newPlan[currentDayIndex]) {
            const exercises = newPlan[currentDayIndex].exercises;
            const exerciseIndex = exercises.findIndex(ex => ex.id === id);
            if (exerciseIndex > -1) {
              exercises[exerciseIndex].completed = !exercises[exerciseIndex].completed;
            }
        }
        return newPlan;
      });
    };

    const handleAddExercise = (newExercise: Omit<Exercise, 'id' | 'completed'>) => {
        setWorkoutPlan(prevPlan => {
            const newPlan = prevPlan.length > 0 ? [...prevPlan] : [{ day: t('customWorkout'), exercises: [] }];
            if(!newPlan[currentDayIndex]){
                newPlan[currentDayIndex] = {day: t('customWorkout'), exercises: []};
            }
            newPlan[currentDayIndex].exercises.push({ ...newExercise, id: crypto.randomUUID(), completed: false });
            return newPlan;
        });
        setIsModalOpen(false);
    };
    
    const handleUpdateExercise = (updatedExercise: Exercise) => {
        setWorkoutPlan(prevPlan => prevPlan.map((day, index) => {
            if (index !== currentDayIndex) return day;
            return {
                ...day,
                exercises: day.exercises.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex)
            };
        }));
        setIsModalOpen(false);
        setEditingExercise(null);
    };

    const handleDeleteExercise = (id: string) => {
        setWorkoutPlan(prevPlan => prevPlan.map((day, index) => {
            if (index !== currentDayIndex) return day;
            return { ...day, exercises: day.exercises.filter(ex => ex.id !== id) };
        }));
    };

    const handleFinishWorkout = () => {
        const currentWorkout = workoutPlan[currentDayIndex];
        if (!currentWorkout) return;
        const newHistoryItem: HistoryItem = {
            date: new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            workoutName: currentWorkout.day,
            exercises: [...currentWorkout.exercises],
        };
        const newHistory = [newHistoryItem, ...history];
        setHistory(newHistory);
        checkAndUnlockAchievements(newHistory);

        setTimeout(() => {
            // Remove the completed workout from the plan.
            const newPlan = workoutPlan.filter((_, index) => index !== currentDayIndex);
            setWorkoutPlan(newPlan);
            
            // If the current index is now out of bounds (e.g., we removed the last item),
            // reset to 0. Otherwise, the index stays the same to show the next item.
            if (currentDayIndex >= newPlan.length) {
                setCurrentDayIndex(0);
            }
        }, 500);
    };

    return (
        <>
            <Header onShowSettings={handleToggleSettings} t={t} />
            <main className="main-content">
                {activeView === 'workout' && (
                    <WorkoutView
                        workoutDay={workoutPlan[currentDayIndex]}
                        aiReasoning={aiReasoning}
                        onDismissReasoning={() => setAiReasoning(null)}
                        onToggleExercise={handleToggleExercise}
                        onDeleteExercise={handleDeleteExercise}
                        onEditExercise={(ex) => { setEditingExercise(ex); setIsModalOpen(true); }}
                        onAddExercise={() => { setEditingExercise(null); setIsModalOpen(true); }}
                        onFinishWorkout={handleFinishWorkout}
                        onPlayVideo={(url) => setSelectedVideoUrl(url)}
                        onExplainExercise={handleExplainExercise}
                        t={t}
                    />
                )}
                {activeView === 'ai' && (
                    <AIPlannerView
                        userProfile={userProfile}
                        setUserProfile={setUserProfile}
                        onGeneratePlan={handleGeneratePlan}
                        isLoading={isLoading}
                        error={error}
                        t={t}
                    />
                )}
                {activeView === 'nutrition' && (
                    <AINutritionView
                        onGeneratePlan={handleGenerateNutritionPlan}
                        isLoading={isNutritionLoading}
                        error={nutritionError}
                        plan={nutritionPlan}
                        t={t}
                    />
                )}
                {activeView === 'history' && <HistoryView history={history} unlockedAchievements={unlockedAchievements} t={t} />}
                {activeView === 'settings' && (
                    <SettingsView 
                        theme={theme}
                        setTheme={setTheme}
                        language={language}
                        setLanguage={setLanguage}
                        fontFamily={fontFamily}
                        setFontFamily={setFontFamily}
                        fontSizeMultiplier={fontSizeMultiplier}
                        setFontSizeMultiplier={setFontSizeMultiplier}
                        animationsEnabled={animationsEnabled}
                        setAnimationsEnabled={setAnimationsEnabled}
                        t={t}
                    />
                )}
                {activeView === 'coach' && (
                    <AICoachView 
                        history={chatHistory}
                        isLoading={isCoachLoading}
                        onSendMessage={handleSendMessageToCoach}
                        t={t}
                    />
                )}
            </main>
            <BottomNav activeView={activeView} setActiveView={setActiveView} t={t} />
            {showAchievementToast && (
                <AchievementToast 
                    achievement={showAchievementToast}
                    onDismiss={() => setShowAchievementToast(null)}
                    t={t}
                />
            )}
            {isModalOpen && (
                <ExerciseModal
                    exercise={editingExercise}
                    onSave={editingExercise ? handleUpdateExercise : handleAddExercise}
                    onClose={() => { setIsModalOpen(false); setEditingExercise(null); }}
                    t={t}
                />
            )}
            {selectedVideoUrl && (
                <VideoModal 
                    videoUrl={selectedVideoUrl} 
                    onClose={() => setSelectedVideoUrl(null)}
                    t={t}
                />
            )}
            {isInfoModalOpen && (
                <ExerciseInfoModal
                    exerciseName={exerciseInfo.name}
                    content={exerciseInfo.content}
                    isLoading={isInfoLoading}
                    onClose={() => setIsInfoModalOpen(false)}
                    t={t}
                />
            )}
        </>
    );
};

// --- Components ---
const Header: React.FC<{ onShowSettings: () => void; t: TFunction }> = ({ onShowSettings, t }) => (
    <header className="app-header">
        <h1 className="app-title">{t('appTitle')}</h1>
        <div className="header-actions">
            <button onClick={onShowSettings} className="header-action-btn" aria-label={t('settings')}>
                <i className="fa-solid fa-gear"></i>
            </button>
        </div>
    </header>
);

const BottomNav: React.FC<{ activeView: string; setActiveView: (view: View) => void; t: TFunction; }> = ({ activeView, setActiveView, t }) => (
    <nav className="bottom-nav">
        <button className={`nav-button ${activeView === 'workout' ? 'active' : ''}`} onClick={() => setActiveView('workout')}>
            <i className="fa-solid fa-dumbbell"></i>
            <span>{t('workout')}</span>
        </button>
        <button className={`nav-button ${activeView === 'ai' ? 'active' : ''}`} onClick={() => setActiveView('ai')}>
            <i className="fa-solid fa-robot"></i>
            <span>{t('aiPlanner')}</span>
        </button>
        <button className={`nav-button ${activeView === 'nutrition' ? 'active' : ''}`} onClick={() => setActiveView('nutrition')}>
            <i className="fa-solid fa-apple-whole"></i>
            <span>{t('nutrition')}</span>
        </button>
        <button className={`nav-button ${activeView === 'coach' ? 'active' : ''}`} onClick={() => setActiveView('coach')}>
            <i className="fa-solid fa-comments"></i>
            <span>{t('aiCoach')}</span>
        </button>
        <button className={`nav-button ${activeView === 'history' ? 'active' : ''}`} onClick={() => setActiveView('history')}>
            <i className="fa-solid fa-clock-rotate-left"></i>
            <span>{t('history')}</span>
        </button>
    </nav>
);

const AIReasoningCard: React.FC<{ reasoning: string; onDismiss: () => void; t: TFunction }> = ({ reasoning, onDismiss, t }) => (
    <div className="ai-reasoning-card">
        <div className="ai-reasoning-header">
            <i className="fa-solid fa-lightbulb"></i>
            <h3>{t('whyThisPlan')}</h3>
            <button onClick={onDismiss} aria-label={t('closeExplanation')}><i className="fa-solid fa-xmark"></i></button>
        </div>
        <p>{reasoning}</p>
    </div>
);

const WorkoutView: React.FC<{
    workoutDay?: WorkoutDay;
    aiReasoning: string | null;
    onDismissReasoning: () => void;
    onToggleExercise: (id: string) => void;
    onDeleteExercise: (id: string) => void;
    onEditExercise: (exercise: Exercise) => void;
    onAddExercise: () => void;
    onFinishWorkout: () => void;
    onPlayVideo: (url: string) => void;
    onExplainExercise: (exerciseName: string) => void;
    t: TFunction;
}> = ({ workoutDay, aiReasoning, onDismissReasoning, onToggleExercise, onDeleteExercise, onEditExercise, onAddExercise, onFinishWorkout, onPlayVideo, onExplainExercise, t }) => {
    
    if (!workoutDay || workoutDay.exercises.length === 0) {
        return (
            <div className="view-container">
                <h2>{t('todayWorkout')}</h2>
                <div className="no-data">
                    <i className="fa-solid fa-clipboard-list"></i>
                    <p>{t('noExercises')}</p>
                    <p>{t('addOrGenerate')}</p>
                </div>
                 <button onClick={onAddExercise} className="btn fab add-exercise-btn">
                    <i className="fa-solid fa-plus"></i> {t('addExercise')}
                </button>
            </div>
        );
    }
    
    const completedCount = workoutDay.exercises.filter(ex => ex.completed).length;
    const totalCount = workoutDay.exercises.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const allCompleted = totalCount > 0 && completedCount === totalCount;

    return (
        <div className="view-container">
            <h2>{workoutDay.day}</h2>

            {aiReasoning && <AIReasoningCard reasoning={aiReasoning} onDismiss={onDismissReasoning} t={t} />}

            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                <span>{completedCount} / {totalCount}</span>
            </div>

            <div className="exercise-cards-wrapper">
                {workoutDay.exercises.map(ex => (
                    <ExerciseCard key={ex.id} exercise={ex} onToggle={onToggleExercise} onDelete={onDeleteExercise} onEdit={onEditExercise} onPlayVideo={onPlayVideo} onExplain={onExplainExercise} t={t}/>
                ))}
            </div>

            <div className="workout-actions">
                <button onClick={onFinishWorkout} disabled={!allCompleted} className={`btn ${allCompleted ? 'celebrate' : ''}`}>
                    <i className="fa-solid fa-flag-checkered"></i> {t('finishWorkout')}
                </button>
                <button onClick={onAddExercise} className="btn-text add-exercise-btn">
                    <i className="fa-solid fa-plus"></i> {t('addExercise')}
                </button>
            </div>
        </div>
    );
};

const ExerciseCard: React.FC<{
    exercise: Exercise;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (exercise: Exercise) => void;
    onPlayVideo: (url: string) => void;
    onExplain: (exerciseName: string) => void;
    t: TFunction;
}> = ({ exercise, onToggle, onDelete, onEdit, onPlayVideo, onExplain, t }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const [isSwiping, setIsSwiping] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentX, setCurrentX] = useState(0);
    const [lockedDirection, setLockedDirection] = useState<'none' | 'horizontal' | 'vertical'>('none');
    const threshold = 80;
    const directionLockThreshold = 10;
    const [timer, setTimer] = useState<number | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const stopTimer = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        if (exercise.completed && exercise.restTime && timer === null) {
            setTimer(exercise.restTime);
            intervalRef.current = setInterval(() => {
                setTimer(prev => {
                    if (prev !== null && prev > 1) {
                        return prev - 1;
                    }
                    stopTimer();
                    return 0; // Timer finished
                });
            }, 1000);
        } else if (!exercise.completed) {
            stopTimer();
            setTimer(null);
        }

        return () => stopTimer(); // Cleanup on unmount or re-render
    }, [exercise.completed, exercise.restTime]);
    
    const resetPosition = () => {
        if (cardRef.current) cardRef.current.style.transform = 'translateX(0px)';
        if (backgroundRef.current) backgroundRef.current.style.opacity = '0';
        setCurrentX(0);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length !== 1 || (e.target as HTMLElement).closest('.action-btn')) {
            if (isSwiping) {
                resetPosition();
                setIsSwiping(false);
            }
            return;
        }
        setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        setIsSwiping(true);
        setLockedDirection('none');
        if (cardRef.current) cardRef.current.style.transition = 'none';
        if (backgroundRef.current) backgroundRef.current.style.transition = 'opacity 0.2s ease';
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isSwiping || e.touches.length !== 1) {
             if (isSwiping) {
                resetPosition();
                setIsSwiping(false);
                setLockedDirection('none');
            }
            return;
        }

        const deltaX = e.touches[0].clientX - startPos.x;
        const deltaY = e.touches[0].clientY - startPos.y;

        if (lockedDirection === 'none') {
            if (Math.abs(deltaX) > directionLockThreshold || Math.abs(deltaY) > directionLockThreshold) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    setLockedDirection('horizontal');
                } else {
                    setLockedDirection('vertical');
                }
            }
        }

        if (lockedDirection === 'horizontal') {
            e.preventDefault(); // Prevent vertical scroll while swiping horizontally
            setCurrentX(deltaX);
            if (cardRef.current) {
                cardRef.current.style.transform = `translateX(${deltaX}px)`;
            }
            if (backgroundRef.current) {
                const opacity = Math.min(Math.abs(deltaX) / threshold, 1);
                backgroundRef.current.style.opacity = `${opacity}`;
            }
        }
    };

    const handleTouchEnd = () => {
        if (!isSwiping) return;
        setIsSwiping(false);
        if (cardRef.current) cardRef.current.style.transition = 'transform 0.3s ease';

        if (lockedDirection === 'horizontal') {
            if (currentX > threshold) { // Swiped right
                if (cardRef.current) {
                    cardRef.current.style.transform = `translateX(100%)`;
                    cardRef.current.style.opacity = '0';
                }
                setTimeout(() => onDelete(exercise.id), 300);
            } else if (currentX < -threshold) { // Swiped left
                onEdit(exercise);
                resetPosition();
            } else {
                resetPosition();
            }
        } else {
            resetPosition();
        }
    };

    return (
        <div className="swipe-container">
            <div ref={backgroundRef} className={`swipe-background ${currentX > 0 ? 'delete-bg' : 'edit-bg'}`}>
                <div className="swipe-action right">
                    <i className="fa-solid fa-pencil"></i>
                    <span>{t('edit')}</span>
                </div>
                <div className="swipe-action left">
                    <i className="fa-solid fa-trash-can"></i>
                    <span>{t('delete')}</span>
                </div>
            </div>
            <div
                ref={cardRef}
                className={`exercise-card ${exercise.completed ? 'completed' : ''}`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="checkbox-container" onClick={() => onToggle(exercise.id)}>
                    <div className={`exercise-checkbox ${exercise.completed ? 'checked' : ''}`}>
                        {exercise.completed && <i className="fa-solid fa-check"></i>}
                    </div>
                </div>
                <div className="exercise-details">
                    <h3>{exercise.name}</h3>
                    <p>
                        <span><i className="fa-solid fa-layer-group"></i> {exercise.sets} {t('sets')}</span>
                        <span><i className="fa-solid fa-repeat"></i> {exercise.reps} {t('reps')}</span>
                        {exercise.weight && <span><i className="fa-solid fa-weight-hanging"></i> {exercise.weight} {t('kg')}</span>}
                        {exercise.restTime && <span><i className="fa-solid fa-clock"></i> {exercise.restTime}{t('restTimeSeconds')}</span>}
                    </p>
                    {timer !== null && timer > 0 && (
                        <div className="exercise-timer-wrapper">
                            <p className="exercise-timer">{timer}s: {t('resting')}</p>
                        </div>
                    )}
                </div>
                <div className="exercise-actions">
                    <button className="action-btn info" onClick={() => onExplain(exercise.name)} aria-label={t('explainExercise')}>
                        <i className="fa-solid fa-circle-info"></i>
                    </button>
                    {exercise.videoUrl && (
                        <button className="action-btn video" onClick={() => onPlayVideo(exercise.videoUrl!)} aria-label={t('watchVideo')}>
                            <i className="fa-solid fa-circle-play"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const AIPlannerView: React.FC<{
    userProfile: UserProfile;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
    onGeneratePlan: () => void;
    isLoading: boolean;
    error: string | null;
    t: TFunction;
}> = ({ userProfile, setUserProfile, onGeneratePlan, isLoading, error, t }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserProfile(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="view-container">
            <h2>{t('aiPlannerTitle')}</h2>
            <p className="view-description">{t('aiPlannerDescription')}</p>
            {isLoading ? (
                 <div className="ai-thinking-box">
                    <div className="ai-icon-container">
                        <i className="fa-solid fa-robot"></i>
                    </div>
                    <p>{t('generatingPlan')}<span className="dots"><span>.</span><span>.</span><span>.</span></span></p>
                </div>
            ) : (
                <>
                    <div className="form-group">
                        <label htmlFor="age">{t('age')}</label>
                        <input type="number" id="age" name="age" value={userProfile.age} onChange={handleChange} placeholder={t('agePlaceholder')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="weight">{t('weight')}</label>
                        <input type="number" id="weight" name="weight" value={userProfile.weight} onChange={handleChange} placeholder={t('weightPlaceholder')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="height">{t('height')}</label>
                        <input type="number" id="height" name="height" value={userProfile.height} onChange={handleChange} placeholder={t('heightPlaceholder')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="goal">{t('goal')}</label>
                        <select id="goal" name="goal" value={userProfile.goal} onChange={handleChange}>
                            <option value="build_muscle">{t('goal_build_muscle')}</option>
                            <option value="lose_weight">{t('goal_lose_weight')}</option>
                            <option value="general_fitness">{t('goal_general_fitness')}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="experience">{t('experience')}</label>
                        <select id="experience" name="experience" value={userProfile.experience} onChange={handleChange}>
                            <option value="beginner">{t('experience_beginner')}</option>
                            <option value="intermediate">{t('experience_intermediate')}</option>
                            <option value="advanced">{t('experience_advanced')}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="equipment">{t('equipment')}</label>
                        <select id="equipment" name="equipment" value={userProfile.equipment} onChange={handleChange}>
                            <option value="full_gym">{t('equipment_full_gym')}</option>
                            <option value="home_weights">{t('equipment_home_weights')}</option>
                            <option value="no_equipment">{t('equipment_no_equipment')}</option>
                        </select>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button onClick={onGeneratePlan} disabled={isLoading} className="btn">
                        <i className="fa-solid fa-wand-magic-sparkles"></i> {t('generatePlan')}
                    </button>
                </>
            )}
        </div>
    );
};

const AINutritionView: React.FC<{
    onGeneratePlan: (query: string) => void;
    isLoading: boolean;
    error: string | null;
    plan: NutritionPlan | null;
    t: TFunction;
}> = ({ onGeneratePlan, isLoading, error, plan, t }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onGeneratePlan(query);
        }
    };

    return (
        <div className="view-container">
            <h2>{t('nutritionTitle')}</h2>
            <p className="view-description">{t('nutritionDescription')}</p>

            <form onSubmit={handleSubmit} className="nutrition-form">
                <div className="form-group">
                    <textarea 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('nutritionPlaceholder')}
                        rows={3}
                    />
                </div>
                <button type="submit" className="btn" disabled={isLoading || !query.trim()}>
                    <i className="fa-solid fa-utensils"></i> {t('generateMealPlan')}
                </button>
            </form>
            
            {isLoading && (
                <div className="ai-thinking-box mini">
                    <p>{t('generatingMealPlan')}<span className="dots"><span>.</span><span>.</span><span>.</span></span></p>
                </div>
            )}
            
            {error && <p className="error-message">{error}</p>}

            {plan && (
                <div className="meal-plan-results">
                    {plan.map((meal, index) => (
                        <div key={index} className="meal-card">
                            <h3>{meal.name}</h3>
                            <p className="meal-description">{meal.description}</p>
                            <div className="meal-details">
                                <h4>{t('ingredients')}</h4>
                                <ul>
                                    {meal.ingredients.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                                <h4>{t('instructions')}</h4>
                                <ol>
                                    {meal.instructions.map((item, i) => <li key={i}>{item}</li>)}
                                </ol>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const HistoryView: React.FC<{ history: HistoryItem[]; unlockedAchievements: AchievementId[]; t: TFunction }> = ({ history, unlockedAchievements, t }) => {
    return (
        <div className="view-container">
            <h2>{t('historyTitle')}</h2>
            
            <div className="settings-section">
                <h3>{t('personalRecords')}</h3>
                <PersonalRecordsSection history={history} t={t} />
            </div>

            <div className="settings-section">
                <h3>{t('achievements')}</h3>
                <AchievementsSection unlockedAchievements={unlockedAchievements} t={t} />
            </div>

            {history.length === 0 ? (
                <div className="no-data">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    <p>{t('noHistory')}</p>
                    <p>{t('completeWorkoutPrompt')}</p>
                </div>
            ) : (
                history.map((item, index) => <HistoryItemCard key={index} item={item} t={t} />)
            )}
        </div>
    );
};

const PersonalRecordsSection: React.FC<{ history: HistoryItem[], t: TFunction }> = ({ history, t }) => {
    const personalRecords = history.reduce((prs, workout) => {
        workout.exercises.forEach(exercise => {
            if (exercise.weight) {
                if (!prs[exercise.name] || exercise.weight > prs[exercise.name]) {
                    prs[exercise.name] = exercise.weight;
                }
            }
        });
        return prs;
    }, {} as Record<string, number>);

    const prList = Object.entries(personalRecords).sort((a,b) => b[1] - a[1]);

    if(prList.length === 0) {
        return (
            <div className="no-data-inset">
                <i className="fa-solid fa-trophy"></i>
                <p><strong>{t('noPRs')}</strong></p>
                <p>{t('trackWeightsPrompt')}</p>
            </div>
        )
    }

    return (
        <div className="pr-grid">
            {prList.map(([name, weight]) => (
                <div key={name} className="pr-card">
                    <i className="fa-solid fa-trophy pr-icon"></i>
                    <div className="pr-details">
                        <h4>{name}</h4>
                        <p>{weight} {t('kg')}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const AchievementsSection: React.FC<{ unlockedAchievements: AchievementId[], t: TFunction }> = ({ unlockedAchievements, t }) => (
    <div className="achievements-grid">
        {Object.values(allAchievements).map(ach => {
            const isUnlocked = unlockedAchievements.includes(ach.id);
            return (
                <div key={ach.id} className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                    <div className="achievement-icon-wrapper"><i className={ach.icon}></i></div>
                    <div className="achievement-details">
                        <h4>{t(`achievement_${ach.id}_title`)}</h4>
                        <p>{t(`achievement_${ach.id}_desc`)}</p>
                    </div>
                </div>
            );
        })}
    </div>
);

const HistoryItemCard: React.FC<{ item: HistoryItem, t: TFunction }> = ({ item, t }) => {
    const [isOpen, setIsOpen] = useState(false);
    const totalSets = item.exercises.reduce((acc, ex) => acc + (ex.completed ? ex.sets : 0), 0);
    const totalReps = item.exercises
        .filter(ex => ex.completed)
        .map(ex => {
            const repsRange = ex.reps.split('-').map(Number);
            return ex.sets * (repsRange[repsRange.length-1] || 0);
        })
        .reduce((acc, val) => acc + val, 0);

    return (
        <div className={`history-item ${isOpen ? 'open' : ''}`}>
            <div className="history-item-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="history-item-summary">
                    <h3>{item.workoutName}</h3>
                    <p>{item.date}</p>
                    <div className="history-item-details-summary">
                        <span className="summary-stat"><i className="fa-solid fa-layer-group"></i> {totalSets} {t('totalSetsLabel')}</span>
                    </div>
                </div>
                <div className="history-item-stats">
                    <i className="fa-solid fa-chevron-down"></i>
                </div>
            </div>
            <div className="history-item-details-wrapper">
                <div className="history-item-details">
                    <ul>
                        {item.exercises.map(ex => (
                            <li key={ex.id} className={ex.completed ? 'completed' : ''}>
                                <i className={`fa-solid ${ex.completed ? 'fa-check-circle' : 'fa-circle'}`}></i>
                                <span>{ex.name}: {ex.sets} x {ex.reps} {ex.weight ? `(${ex.weight} kg)` : ''}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const SettingsView: React.FC<{
    theme: Theme;
    setTheme: (theme: Theme) => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    fontFamily: string;
    setFontFamily: (font: string) => void;
    fontSizeMultiplier: number;
    setFontSizeMultiplier: (size: number) => void;
    animationsEnabled: boolean;
    setAnimationsEnabled: (enabled: boolean) => void;
    t: TFunction;
}> = ({ theme, setTheme, language, setLanguage, fontFamily, setFontFamily, fontSizeMultiplier, setFontSizeMultiplier, animationsEnabled, setAnimationsEnabled, t }) => (
    <div className="view-container">
        <h2>{t('settingsTitle')}</h2>
        <div className="settings-section">
            <h3>{t('display')}</h3>
            <div className="form-group">
                <label>{t('language')}</label>
                <div className="segmented-control">
                    <button onClick={() => setLanguage('en')} className={language === 'en' ? 'active' : ''}>English</button>
                    <button onClick={() => setLanguage('ar')} className={language === 'ar' ? 'active' : ''}>العربية</button>
                </div>
            </div>
            <div className="form-group">
                <label>{t('theme')}</label>
                 <div className="segmented-control">
                    <button onClick={() => setTheme('light')} className={theme === 'light' ? 'active' : ''}><i className="fa-solid fa-sun"></i> {t('light')}</button>
                    <button onClick={() => setTheme('dark')} className={theme === 'dark' ? 'active' : ''}><i className="fa-solid fa-moon"></i> {t('dark')}</button>
                </div>
            </div>
            <div className="form-group">
                <label>{t('animations')}</label>
                 <div className="segmented-control">
                    <button onClick={() => setAnimationsEnabled(true)} className={animationsEnabled ? 'active' : ''}>{t('enabled')}</button>
                    <button onClick={() => setAnimationsEnabled(false)} className={!animationsEnabled ? 'active' : ''}>{t('disabled')}</button>
                </div>
            </div>
        </div>
        <div className="settings-section">
            <h3>{t('font')}</h3>
            <div className="form-group">
                <label>{t('fontFamily')}</label>
                <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                    <option value="'Cairo', sans-serif">Cairo</option>
                    <option value="'Noto Sans Arabic', sans-serif">Noto Sans Arabic</option>
                    <option value="'Markazi Text', serif">Markazi Text</option>
                </select>
            </div>
             <div className="form-group">
                <label>{t('fontSize')}</label>
                <div className="font-size-slider">
                    <span>A</span>
                    <input 
                        type="range" 
                        min="0.7" 
                        max="1.1" 
                        step="0.05" 
                        value={fontSizeMultiplier} 
                        onChange={(e) => setFontSizeMultiplier(parseFloat(e.target.value))}
                    />
                    <span>A</span>
                </div>
            </div>
        </div>
    </div>
);

const AICoachView: React.FC<{
    history: ChatMessage[];
    isLoading: boolean;
    onSendMessage: (message: string, image?: { mimeType: string; data: string; }) => void;
    t: TFunction;
}> = ({ history, isLoading, onSendMessage, t }) => {
    const [message, setMessage] = useState('');
    const [image, setImage] = useState<{ file: File, preview: string, data: string } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history, isLoading]);
    
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64Data = await fileToBase64(file);
            setImage({
                file,
                preview: URL.createObjectURL(file),
                data: base64Data
            });
        }
    };

    const handleSend = () => {
        if (message.trim() || image) {
            onSendMessage(message, image ? { mimeType: image.file.type, data: image.data } : undefined);
            setMessage('');
            setImage(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    };
    
    return (
        <div className="coach-view-container">
            {image ? (
                <div className="fullscreen-image-preview">
                    <img src={image.preview} alt="Preview" />
                    <button className="close-preview-btn" onClick={() => {
                         setImage(null);
                         if(fileInputRef.current) fileInputRef.current.value = "";
                    }}><i className="fa-solid fa-xmark"></i></button>
                </div>
            ) : (
                <div className="chat-messages">
                    {history.map((msg, index) => (
                        <div key={index} className={`message-bubble-wrapper ${msg.role}`}>
                            <div className="message-bubble">
                                {msg.parts.map((part, i) => {
                                    if ('text' in part) {
                                        return <div key={i}>{part.text}</div>;
                                    } else if ('inlineData' in part) {
                                        return <img key={i} src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`} alt="chat content" style={{maxWidth: '100%', borderRadius: '10px'}}/>
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="message-bubble-wrapper model">
                            <div className="message-bubble">
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}
            <div className="chat-input-area">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t('askQuestionPlaceholder')}
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                />
                <button onClick={() => fileInputRef.current?.click()} aria-label={t('attachImage')}>
                     <i className="fa-solid fa-paperclip"></i>
                </button>
                <button onClick={handleSend} disabled={isLoading || (!message.trim() && !image)}>
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};


const ExerciseModal: React.FC<{
    exercise: Exercise | null;
    onSave: (data: any) => void;
    onClose: () => void;
    t: TFunction;
}> = ({ exercise, onSave, onClose, t }) => {
    const [formData, setFormData] = useState({
        name: exercise?.name || '',
        sets: exercise?.sets || 3,
        reps: exercise?.reps || '8-12',
        videoUrl: exercise?.videoUrl || '',
        restTime: exercise?.restTime || 60,
        weight: exercise?.weight || 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = () => {
        if (!formData.name) return; // Basic validation
        if (exercise) {
            onSave({ ...exercise, ...formData });
        } else {
            onSave(formData);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>{exercise ? t('editExerciseTitle') : t('addExerciseTitle')}</h3>
                <div className="form-group">
                    <label htmlFor="name">{t('exerciseName')}</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="sets">{t('sets')}</label>
                    <input type="number" id="sets" name="sets" value={formData.sets} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="reps">{t('reps')}</label>
                    <input type="text" id="reps" name="reps" value={formData.reps} onChange={handleChange} />
                </div>
                 <div className="form-group">
                    <label htmlFor="weight">{t('weight')}</label>
                    <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="restTime">{t('restTime')}</label>
                    <input type="number" id="restTime" name="restTime" value={formData.restTime} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="videoUrl">{t('videoUrl')}</label>
                    <input type="text" id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder={t('videoUrlPlaceholder')} />
                </div>
                <div className="modal-actions">
                    <button onClick={onClose} className="btn btn-secondary btn-small">{t('cancel')}</button>
                    <button onClick={handleSubmit} className="btn btn-small">{exercise ? t('saveChanges') : t('add')}</button>
                </div>
            </div>
        </div>
    );
};

const VideoModal: React.FC<{ videoUrl: string, onClose: () => void, t: TFunction }> = ({ videoUrl, onClose, t }) => {
    const getEmbedUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'youtu.be') {
                return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
            }
            if (urlObj.hostname.includes('youtube.com')) {
                const videoId = urlObj.searchParams.get('v');
                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId}`;
                }
            }
        } catch (error) {
            console.error("Invalid URL for embedding:", error);
            return null;
        }
        return null;
    };

    const embedUrl = getEmbedUrl(videoUrl);

    if (!embedUrl) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content">
                    <p>{t('invalidVideo')}</p>
                    <button onClick={onClose}>{t('close')}</button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <button className="close-modal-btn" onClick={onClose} aria-label={t('closeVideo')}>&times;</button>
            <div className="modal-content video-modal" onClick={e => e.stopPropagation()}>
                <div className="video-responsive">
                    <iframe
                        src={embedUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                    </iframe>
                </div>
            </div>
        </div>
    );
};

const ExerciseInfoModal: React.FC<{
    exerciseName: string;
    content: ExerciseInfo | null;
    isLoading: boolean;
    onClose: () => void;
    t: TFunction;
}> = ({ exerciseName, content, isLoading, onClose, t }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{t('exerciseInfo')}: {exerciseName}</h3>
            {isLoading ? (
                <div className="ai-thinking-box mini">
                    <p>{t('loadingExplanation')}</p>
                </div>
            ) : content ? (
                <div className="info-modal-content">
                    <h4>{t('description')}</h4>
                    <p>{content.description}</p>
                    
                    <h4>{t('musclesTargeted')}</h4>
                    <p>{content.muscles}</p>
                    
                    <h4>{t('formTips')}</h4>
                    <ul>
                        {content.tips.map((tip, index) => (
                            <li key={index}><i className="fa-solid fa-check"></i> {tip}</li>
                        ))}
                    </ul>
                </div>
            ) : null}
            <div className="modal-actions">
                <button onClick={onClose} className="btn btn-secondary btn-small">{t('close')}</button>
            </div>
        </div>
    </div>
);


const AchievementToast: React.FC<{
    achievement: Achievement;
    onDismiss: () => void;
    t: TFunction;
}> = ({ achievement, onDismiss, t }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 5000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className="achievement-toast">
            <div className="achievement-toast-icon">
                <i className={achievement.icon}></i>
            </div>
            <div className="achievement-toast-details">
                <h4>{t('achievementUnlocked')}</h4>
                <p>{t(`achievement_${achievement.id}_title`)}</p>
            </div>
            <button onClick={onDismiss} className="achievement-toast-close">&times;</button>
        </div>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);