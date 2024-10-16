const AnswerGenerate= require("../services/generate");

const answerGenerate =new AnswerGenerate();

class generateAnswer{
    constructor(){
  
    }
    async answer (req,res){
        const input = req.body;
        try {
            const answer = await answerGenerate.answer(input); // Use the injected service instance
            res.status(200).json(answer); // Respond with the item
          } catch (error) {
            res.status(500).json({ message: error.message }); // Handle errors
          }

    }

}

module.exports = generateAnswer;