import { sql} from "../config/idb.js";

export const getDoubts=async (req, res) => {
  try {
    const { topic } = req.query;
    
    const doubts = topic 
      ? await sql`
          SELECT *
          FROM doubts2
          WHERE topic=${topic}
        `
      : await sql`
          SELECT *
        FROM   doubts2;
        `;
    
    res.json(doubts);
  } catch (error) {
    console.error('Error fetching doubts', error);
    res.status(500).json({ error: 'Failed to fetch doubts' });
  }
}

export const createDoubt =async (req, res) => {
  try {
    const { title,question,topic} = req.body;
    const userid = req.user.userid;

    const [doubts] = await sql`
      INSERT INTO doubts2 (title, question,userid, topic)
      VALUES (${title}, ${question}, ${userid}, ${topic})
      RETURNING 
        doubts2.*,
        (SELECT full_name FROM users2 WHERE userid = ${userid}) as author
    `;
    res.status(201).json(doubts);
  } catch (error) {
    console.error('Error creating doubt', error);
    res.status(500).json({ error: 'Failed to create doubt ' });
  }
}

export const getUserDoubts=async (req, res) => {
  try {
    const userid = req.user.userid;
    
    const doubts= await sql`
      SELECT 
        d.*,
        u.full_name as author
      FROM doubts2 d
      JOIN users2 u ON d.userid = u.userid
      WHERE d.userid = ${userid}
      ORDER BY d.createdAt DESC
    `;
    res.json(doubts);
  } catch (error) {
    console.error('Error fetching user  doubts:', error);
    res.status(500).json({ error: 'Failed to fetch user doubts' });
  }
};

export const getReplies =async(req,res)=>{
    try {
         const {doubtid}=req.params;
        const replies=await sql`SELECT * FROM doubt_replies2 WHERE doubtid=${doubtid}`
        res.json(replies);
    }
    catch (error) {
        console.log("error occured while fetching replies")
        res.status(500).json({error:"failed to fetch replies of doubt"});
    }

}

export const addReply =async(req,res)=>{
    try {
        const {doubtid}=req.params;
        const userid=req.user.userid;
        const {reply}=req.body;
        const  newReply= await sql `INSERT INTO doubt_replies2 (doubtid,userid,reply) VALUES (${doubtid},${userid},${reply})
        RETURNING *
        `
        res.json(newReply[0]);
    }
    catch (error) {
          console.log("error occured while posting reply")
        res.status(500).json({error:"failed to post reply of doubt"});
    }
}