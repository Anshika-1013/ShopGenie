// const { OpenAI } = require("openai");

// const openai = new OpenAI({ apiKey: "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" }); // Replace "your-api-key" with your actual API key

// async function main() {
    
// const assistant= await openai.beta.assistants.retrieve(
//     "asst_4Ts2xPVGebqvPopWEqZbroeY"
// );
// console.log(assistant)

// //create a thread
// //const thread = await openai.beta.threads.create();
// //console.log(thread)
// //thread_sd2c8Zn8lopvPDmSzWaT0Cpd
// // const message = await openai.beta.threads.messages.create(
// //     "thread_zxG7x5Sv7tNkWtntFMgBDpmh",
// //             {
// //                 role: "user",
// //                 content: "search for a tshirt with best reviews"
// //             }
// //         );

// // const run =await openai.beta.threads.runs.create("thread_zxG7x5Sv7tNkWtntFMgBDpmh",{
// //     assistant_id: assistant.id,
// //     instructions: "address the user as Adarsh"
// // }
// //  )

//  //console.log(run) // runid run_9JiV2sVA2vzwNoUjuU9D55jb

// //const run = await openai.beta.threads.runs.retrieve("thread_zxG7x5Sv7tNkWtntFMgBDpmh","run_9JiV2sVA2vzwNoUjuU9D55jb")
// //console.log(run)

// const messages = await openai.beta.threads.messages.list("thread_zxG7x5Sv7tNkWtntFMgBDpmh");
// console.log(messages.data) 
// console.log(messages.data[0].content) 

// //console.log(messages.data[0].content[0].text.annotations) 


// // messages.body.data.array.forEach(element => {
// //     console.log(messages.content)
// //});
// }

    
// main().catch(console.error);



