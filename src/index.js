import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, CheckCircle, ChevronLeft, ChevronRight, Edit, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils"
import { format, parseISO, isValid } from 'date-fns';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Helper function to get a quote for a given day (simplified for demonstration)
const getQuoteOfTheDay = (dayOfYear: number) => {
    const quotes = [
        // Day 1
        { text: "The greatest battle you will ever fight is the battle within your own mind.", source: "Unknown" },
        // Day 2
        { text: "Twenty years from now you will be more disappointed by the things that you didn’t do than by the ones you did do.", source: "Mark Twain" },
        // Day 3
        { text: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.", source: "Helen Keller" },
        // Day 4
        { text: "Discipline equals freedom.", source: "Jocko Willink" },
        // Day 5
        { text: "Gratitude turns what we have into enough.", source: "Aesop" },
        // Day 6
        { text: "Be more concerned with your character than your reputation, because your character is what you really are.", source: "John Wooden" },
        // Day 7
        { text: "Trust in the Lord with all thine heart; and lean not unto thine own understanding.", source: "Proverbs 3:5" },
        // Day 8
        { text: "The obstacle is the way.", source: "Marcus Aurelius" },
        // Day 9
        { text: "The journey of a thousand miles begins with a single step.", source: "Lao Tzu" },
        // Day 10
        { text: "It's not what happens to you, but how you react to it that matters.", source: "Epictetus" },
        // Day 11
        { text: "The mind is everything. What you think you become.", source: "Buddha" },
        // Day 12
        { text: "Start where you are. Use what you have. Do what you can.", source: "Arthur Ashe" },
        // Day 13
        { text: "The best way to predict the future is to create it.", source: "Peter Drucker" },
        // Day 14
        { text: "The only way to do great work is to love what you do.", source: "Steve Jobs" },
        // Day 15
        { text: "Life shrinks or expands in proportion to one's courage.", source: "Anaïs Nin" },
        { text: "The world suffers a lot. Not because of the violence of bad people. But because of the silence of good people.", source: "Napoleon" },
        { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", source: "Marcus Aurelius" },
        { text: "The happiness of your life depends upon the quality of your thoughts.", source: "Marcus Aurelius" },
        { text: "Don't look back and regret the past. Learn from it and be done. Don't look forward and fear the future. Live in the present and make the most of it.", source: "Unknown" },
        { text: "The more you are grateful for what you have, the more you will have to be grateful for.", source: "Oprah Winfrey" },
        { text: "The secret of health for both mind and body is not to mourn for the past, worry about the future, or anticipate troubles, but to live in the present moment wisely and earnestly.", source: "Buddha" },
        { text: "Wherever you are, be all there.", source: "Jim Elliot" },
        { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", source: "Zig Ziglar" },
        { text: "Don't wait for opportunity. Create it.", source: "George Bernard Shaw" },
        { text: "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will.", source: "Vince Lombardi" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", source: "Eleanor Roosevelt" },
        { text: "Be more concerned with your character than your reputation, because your character is what you really are, while your reputation is merely what others think you are.", source: "John Wooden" },
        { text: "The time is always right to do what is right.", source: "Martin Luther King Jr." },
        { text: "Integrity is doing the right thing, even when no one is watching.", source: "C.S. Lewis" },
        { text: "Our character is what we do when we think no one is looking.", source: "H. Jackson Brown Jr." },
        { text: "The strength of a nation derives from the integrity of the home.", source: "Confucius" },
        { text: "It is easier to build strong children than to repair broken men.", source: "Frederick Douglass" },
        { text: "A man's true wealth is the good he does in this world.", source: "Unknown" },
        { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", source: "Nelson Mandela" },
        { text: "Treat others as you would like to be treated.", source: "Matthew 7:12" },
        { text: "Let your conscience be your guide.", source: "Pinocchio" },
        { text: "You are the average of the five people you spend the most time with.", source: "Jim Rohn" },
        { text: "The only person you are destined to become is the person you decide to be.", source: "Ralph Waldo Emerson" },
        { text: "Your habits will determine your future.", source: "Jack Canfield" },
        { text: "Small hinges swing big doors.", source: "W. Clement Stone" },
        { text: "If you don't like something, change it. If you can't change it, change your attitude.", source: "Maya Angelou" },
        { text: "It's not about perfect. It's about effort. And when you bring that effort every single day, that's where transformation happens.", source: "Jillian Michaels" },
        { text: "The mind is everything. What you think you become.", source: "Buddha" },
        { text: "The greatest discovery of all time is that a person can change his future by merely changing his attitude.", source: "Oprah Winfrey" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", source: "Winston S. Churchill" },
        { text: "Don't be afraid to give up the good to go for the great.", source: "John D. Rockefeller" },
    ];
    const dayIndex = (dayOfYear - 1) % quotes.length;
    return quotes[dayIndex] || { text: "Embrace the present moment.", source: "Unknown" };
};

const getPromptOfTheDay = (dayOfWeek: number) => {
    const prompts = [
        // Monday
        {
            reflection: "What is one internal 'battle' I am currently facing? How can I approach this battle with courage and intention today?",
            stoicism: "What is one external circumstance that might challenge my peace today? How can I focus on my response rather than trying to control the event itself?",
            personalDevelopment: "What is one small step I can take today to overcome a personal limitation or develop a new skill?",
        },
        // Tuesday
        {
            reflection: "What is one 'adventure,' big or small, that I feel a pull towards experiencing? What is one small step I can take today to move closer to that experience or mindset?",
            success: "What does 'success' mean to me personally, beyond societal definitions? How can I align my actions today with my personal definition of success?",
            mindset: "What is one limiting belief I hold about my potential for adventure or growth? How can I challenge that belief with evidence or a new perspective?",
        },
        // Wednesday
        {
            reflection: "What person, principle, or cause do I feel a strong desire to protect or nurture? What is one small act of care or advocacy I can offer today?",
            gratitude: "What is one often overlooked 'beauty' in my life that I can appreciate with intention today?",
            personalDevelopment: "How can I cultivate more empathy and compassion in my interactions today?",
        },
        // Thursday
        {
            reflection: "In what area of my life would more discipline lead to greater freedom or progress towards my goals? What is one disciplined action I will commit to today?",
            success: "What daily habit, if consistently applied, would have the biggest positive impact on my long-term success? Am I prioritizing that habit today?",
            stoicism: "What is one immediate gratification I might be tempted by today that could detract from my long-term goals? How can I choose the path of discipline instead?",
        },
        // Friday
        {
            reflection: "List three things I am genuinely grateful for today. Why do these things matter to me? How can I fully appreciate them in this moment?",
            mindfulness: "What is one sensory experience I can fully engage with right now (sight, sound, smell, taste, touch)? What can I learn from being fully present in this moment?",
            personalDevelopment: "How can I be more present and engaged in my interactions with others today?",
        },
        // Saturday
        {
            reflection: "What is one of my core values that I want to consciously embody today? How will my actions reflect this value?",
            purpose: "How do the 'battles,' 'adventures,' and 'beauty to rescue' I've identified so far align with my core values? What does this tell me about my potential sense of purpose?",
            stoicism: "What is one judgment I might make today that could cloud my perspective? How can I approach the situation with more objectivity and wisdom?",
        },
        // Sunday
        {
            reflection: "How can I integrate my faith or spiritual principles into my actions and decisions in the coming week? What guidance or strength can I draw upon?",
            goalSetting: "Based on my reflections this week, what is one key intention or goal I want to focus on in the coming week? What are three specific, actionable steps I can take towards it?",
            mindset: "What is one positive affirmation I can carry with me into the new week to cultivate a more resilient and growth-oriented mindset?",
        },
    ];
    const dayIndex = (dayOfWeek - 1) % prompts.length;
    return prompts[dayIndex] || { reflection: "", stoicism: "", personalDevelopment: "" };
};

const DailyJournalPage = () => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [journalEntry, setJournalEntry] = useState<{
        date: string;
        reflection: string;
        stoicism?: string;
        personalDevelopment?: string;
        success?: string;
        mindset?: string;
        gratitude?: string;
        purpose?: string;
        goalSetting?: string;
        aar: string;
    } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [savedEntries, setSavedEntries] = useState<{ [date: string]: typeof journalEntry }>({});
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const dayOfYear = (date: Date) => {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = (date as any) - (start as any) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    };

    const dayOfWeek = currentDate.getDay();
    const quoteObj = getQuoteOfTheDay(dayOfYear(currentDate));
    const promptObj = getPromptOfTheDay(dayOfWeek);

    // Load saved entries from local storage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('dailyJournalEntries');
            if (saved) {
                try {
                    setSavedEntries(JSON.parse(saved));
                } catch (error) {
                    console.error("Error parsing saved journal entries:", error);
                    // Handle the error, e.g., clear the corrupted data
                    localStorage.removeItem('dailyJournalEntries');
                }
            }
        }
    }, []);

    // Save entries to local storage whenever savedEntries changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('dailyJournalEntries', JSON.stringify(savedEntries));
        }
    }, [savedEntries]);

    const formatDate = (date: Date): string => {
        return format(date, 'yyyy-MM-dd');
    };

    const formattedDate = formatDate(currentDate);

    // Load existing entry or create a new one
    useEffect(() => {
        const savedEntry = savedEntries[formattedDate];
        if (savedEntry) {
            setJournalEntry(savedEntry);
            setIsEditing(false); // Load in view mode
        } else {
            setJournalEntry({
                date: formattedDate,
                reflection: "",
                stoicism: "",
                personalDevelopment: "",
                success: "",
                mindset: "",
                gratitude: "",
                purpose: "",
                goalSetting: "",
                aar: "",
            });
            setIsEditing(true); // Start in edit mode for new entries
        }
    }, [currentDate, savedEntries, formattedDate]);

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            setCurrentDate(date);
            setShowCalendar(false); // Close the calendar after selection
        }
    };

    const handleInputChange = (field: keyof typeof journalEntry, value: string) => {
        setJournalEntry(prev => prev ? { ...prev, [field]: value } : { date: formattedDate, [field]: value });
    };

    const handleSave = () => {
        if (journalEntry) {
            setSavedEntries({ ...savedEntries, [formattedDate]: journalEntry });
        }
        setIsEditing(false);
    };

    const handleDelete = () => {
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (journalEntry) {
            const { [formattedDate]: _, ...rest } = savedEntries; // Remove entry for current date
            setSavedEntries(rest);
            setJournalEntry(null); // Clear the current entry
            setIsEditing(true); // Start editing a new entry
        }
        setIsDeleteDialogOpen(false);
    };

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[200px] justify-start text-left font-normal",
                                    !isValid(currentDate) && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {isValid(currentDate) ? format(currentDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <AnimatePresence>
                            {showCalendar && (
                                <PopoverContent className="w-auto p-0" asChild>
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={currentDate}
                                            onSelect={handleDateChange}
                                            initialFocus
                                            className="rounded-md border"
                                        />
                                    </motion.div>
                                </PopoverContent>
                            )}
                        </AnimatePresence>
                    </Popover>
                    <h2 className="text-xl font-semibold">Daily Journal</h2>
                </div>
                {isEditing ? (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleSave}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Save
                        </Button>
                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you sure?</DialogTitle>
                                    <DialogDescription>
                                        This will permanently delete your journal entry for {format(currentDate, "PPP")}.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                                    <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                ) : (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                )}
            </div>
        );
    };

    if (!journalEntry) {
        return (
            <div className="p-4">
                {renderHeader()}
                <p>No journal entry for this date. {isEditing ? "Start writing!" : ""}</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            {renderHeader()}
            <Card>
                <CardHeader>
                    <CardTitle>Quote of the Day</CardTitle>
                </CardHeader>
                <CardContent>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="p-4 rounded-md bg-muted"
                    >
                        <p className="text-lg italic">"{quoteObj.text}"</p>
                        <p className="text-sm mt-2 text-muted-foreground">- {quoteObj.source}</p>
                    </motion.div>
                </CardContent>
            </Card>

            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Reflection</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={journalEntry.reflection}
                                    onChange={(e) => handleInputChange('reflection', e.target.value)}
                                    placeholder={promptObj.reflection || "Reflect on your day..."}
                                    className="min-h-[150px]"
                                />
                            </CardContent>
                        </Card>

                        {promptObj.stoicism && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Stoicism</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={journalEntry.stoicism || ""}
                                        onChange={(e) => handleInputChange('stoicism', e.target.value)}
                                        placeholder={promptObj.stoicism}
                                        className="min-h-[100px]"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {promptObj.personalDevelopment && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Development</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={journalEntry.personalDevelopment || ""}
                                        onChange={(e) => handleInputChange('personalDevelopment', e.target.value)}
                                        placeholder={promptObj.personalDevelopment}
                                        className="min-h-[100px]"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {promptObj.success && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Success</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={journalEntry.success || ""}
                                        onChange={(e) => handleInputChange('success', e.target.value)}
                                        placeholder={promptObj.success}
                                        className="min-h-[100px]"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {promptObj.mindset && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mindset</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={journalEntry.mindset || ""}
                                        onChange={(e) => handleInputChange('mindset', e.target.value)}
                                        placeholder={promptObj.mindset}
                                        className="min-h-[100px]"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {promptObj.gratitude && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gratitude</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={journalEntry.gratitude || ""}
                                        onChange={(e) => handleInputChange('gratitude', e.target.value)}
                                        placeholder={promptObj.gratitude}
                                        className="min-h-[100px]"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {promptObj.purpose && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Purpose</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={journalEntry.purpose || ""}
                                        onChange={(e) => handleInputChange('purpose', e.target.value)}
                                        placeholder={promptObj.purpose}
                                        className="min-h-[100px]"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {promptObj.goalSetting && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Goal Setting</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={journalEntry.goalSetting || ""}
                                        onChange={(e) => handleInputChange('goalSetting', e.target.value)}
                                        placeholder={promptObj.goalSetting}
                                        className="min-h-[100px]"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>After Action Review (AAR)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={journalEntry.aar}
                                    onChange={(e) => handleInputChange('aar', e.target.value)}
                                    placeholder="Reflect on yesterday's actions, outcomes, and lessons learned..."
                                    className="min-h-[150px]"
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isEditing && journalEntry && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Reflection</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 whitespace-pre-line">{journalEntry.reflection || "No reflection written."}</p>
                        </CardContent>
                    </Card>

                    {journalEntry.stoicism && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Stoicism</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-line">{journalEntry.stoicism}</p>
                            </CardContent>
                        </Card>
                    )}

                    {journalEntry.personalDevelopment && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Development</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-line">{journalEntry.personalDevelopment}</p>
                            </CardContent>
                        </Card>
                    )}

                    {journalEntry.success && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Success</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-line">{journalEntry.success}</p>
                            </CardContent>
                        </Card>
                    )}

                    {journalEntry.mindset && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Mindset</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-line">{journalEntry.mindset}</p>
                            </CardContent>
                        </Card>
                    )}

                    {journalEntry.gratitude && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Gratitude</CardTitle>
                            </CardHeader>
                            <CardContent>
                                 <p className="text-gray-700 whitespace-pre-line">{journalEntry.gratitude}</p>
                            </CardContent>
                        </Card>
                    )}

                    {journalEntry.purpose && (
                        <Card>
                            <CardHeader>
                                 <CardTitle>Purpose</CardTitle>
                            </CardHeader>
                            <CardContent>
                                 <p className="text-gray-700 whitespace-pre-line">{journalEntry.purpose}</p>
                            </CardContent>
                        </Card>
                    )}

                    {journalEntry.goalSetting && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Goal Setting</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-line">{journalEntry.goalSetting}</p>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>After Action Review (AAR)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 whitespace-pre-line">{journalEntry.aar || "No AAR written."}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};

export default DailyJournalPage;
