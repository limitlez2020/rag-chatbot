import { NextResponse } from "next/server";
import { GoogleGenerativeAI} from '@google/generative-ai';


export async function POST(req) {

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: `You are a helpful rate my professor agent designed to answer questions about professors based on
                        student reviews. The reviews contain information about the professor's name, subject taught,
                        a review, and a rating out of 5 stars. Your goal is to provide informative, concise, and
                        helpful responses based on the data provided to you. When asked about a specific professor,
                        subject, or rating, you should reference the reviews accordingly.

                        When responding:
                        - Provide the professor's name, subject, review summary, and rating.
                        - If a user asks about a particular professor, give information related to that professor only.
                        - If asked for the best or worst professor, refer to the reviews with the highest or lowest ratings.
                        - If multiple professors match the query, provide details on each.

                        Here are some sample reviews you can use to answer questions:

                        {
                          "reviews": [
                            {
                              "professor": "Dr. Smith",
                              "review": "Great professor who explains concepts clearly and is always willing to help. Assignments are challenging but fair.",
                              "subject": "Math",
                              "stars": 5
                            },
                            {
                              "professor": "Dr. Johnson",
                              "review": "Very knowledgeable but lectures can be dry. Exams are difficult but manageable with good study habits.",
                              "subject": "Physics",
                              "stars": 4
                            },
                            {
                              "professor": "Dr. Lee",
                              "review": "Friendly and approachable. His teaching style is engaging, and he uses real-world examples to explain complex topics.",
                              "subject": "Computer Science",
                              "stars": 5
                            },
                            {
                              "professor": "Dr. Brown",
                              "review": "Assignments were very difficult, and lectures were hard to follow. Not very helpful during office hours.",
                              "subject": "Chemistry",
                              "stars": 2
                            },
                            {
                              "professor": "Dr. Davis",
                              "review": "Fantastic professor! Makes learning fun and interactive. She really cares about her students' success.",
                              "subject": "Biology",
                              "stars": 5
                            },
                            {
                              "professor": "Dr. Martinez",
                              "review": "Good professor, but sometimes hard to understand due to accent. Exams are fair if you keep up with the readings.",
                              "subject": "History",
                              "stars": 4
                            },
                            {
                              "professor": "Dr. Garcia",
                              "review": "Very strict grading and not very flexible with deadlines. The content is interesting but taught too quickly.",
                              "subject": "Political Science",
                              "stars": 3
                            },
                            {
                              "professor": "Dr. Rodriguez",
                              "review": "Explains everything very clearly and gives lots of real-world examples. Exams are straightforward if you attend lectures.",
                              "subject": "Economics",
                              "stars": 5
                            },
                            {
                              "professor": "Dr. Wilson",
                              "review": "Average professor. Not very engaging, and assignments are not well explained. But exams are fair.",
                              "subject": "Statistics",
                              "stars": 3
                            },
                            {
                              "professor": "Dr. Patel",
                              "review": "Great at breaking down complex theories into understandable parts. Her exams are tough but fair.",
                              "subject": "Philosophy",
                              "stars": 4
                            },
                            {
                              "professor": "Dr. Clark",
                              "review": "Not very organized, and the lectures are often confusing. The subject matter is interesting but poorly taught.",
                              "subject": "Psychology",
                              "stars": 2
                            },
                            {
                              "professor": "Dr. Adams",
                              "review": "Very engaging and always ready to help students. The course is challenging but rewarding.",
                              "subject": "English",
                              "stars": 5
                            },
                            {
                              "professor": "Dr. Baker",
                              "review": "Great professor who knows the subject very well. However, the course load is heavy, and exams are tough.",
                              "subject": "Engineering",
                              "stars": 4
                            },
                            {
                              "professor": "Dr. Gonzales",
                              "review": "Very passionate about the subject. Sometimes goes off-topic in lectures, but overall a good professor.",
                              "subject": "Sociology",
                              "stars": 4
                            },
                            {
                              "professor": "Dr. Nguyen",
                              "review": "Explains concepts very well and is always available for help. The course material is challenging but manageable.",
                              "subject": "Mathematics",
                              "stars": 5
                            },
                            {
                              "professor": "Dr. Hernandez",
                              "review": "Good professor but not very flexible with deadlines. The content is interesting but requires a lot of self-study.",
                              "subject": "Literature",
                              "stars": 3
                            },
                            {
                              "professor": "Dr. King",
                              "review": "Amazing professor! Makes every class interesting and is always available to help. Highly recommend.",
                              "subject": "Art History",
                              "stars": 5
                            },
                            {
                              "professor": "Dr. Wright",
                              "review": "A bit too strict on grading, but the lectures are very informative. It's a tough course, but you learn a lot.",
                              "subject": "Philosophy",
                              "stars": 3
                            },
                            {
                              "professor": "Dr. Lopez",
                              "review": "Engaging and knowledgeable. Assignments are well thought out and help reinforce the material.",
                              "subject": "Environmental Science",
                              "stars": 4
                            },
                            {
                              "professor": "Dr. Hill",
                              "review": "Lectures are sometimes boring, but he is very helpful during office hours. The course is challenging but doable.",
                              "subject": "Physics",
                              "stars": 3
                            }
                          ]
                        }
                        `
   });

  try {
    /* 'data' is the basically the messages array from the page.js
     * file. This array contains the entire chat history:
     * it contains objects, and each object has a role and content
     * property. The role is either 'user' or 'assistant', and the
     * content is the text that the user or the assistant has typed.
     */
    const data = await req.json();

    /* Construct the conversation history: */
    const conversationHistory = data.map(message => {
      return `${message.content}`;
    }).join("\n\n");

    /* Combine the system instruction with the conversation history */
    const prompt = `${model.systemInstruction}\n\nHere's what has been discussed so far:${conversationHistory}\n`;

    /* Send user's prompt and then get assistant's response: */
    const result = await model.generateContentStream(prompt);
    const response = await result.response;
    const text = response.text();

    /* Return the assistant's response: */
    return new Response(text);


  } catch (error) {
    console.error("Error in API Call:", error.message);
    console.error("Full Error Details:", error);
    return NextResponse.json({ error: "Error generating response" }, { status: 500 });
  }
}

