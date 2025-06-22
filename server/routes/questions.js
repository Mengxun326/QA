const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 获取所有问题及其回答
router.get('/', async (req, res) => {
  try {
    const [questions] = await pool.execute(`
      SELECT 
        q.id,
        q.title,
        q.content,
        q.author_name,
        q.author_email,
        q.created_at,
        q.updated_at
      FROM questions q
      ORDER BY q.created_at DESC
    `);

    // 为每个问题获取回答
    for (let question of questions) {
      const [answers] = await pool.execute(`
        SELECT 
          a.id,
          a.content,
          a.created_at,
          a.updated_at,
          ad.username as admin_username,
          ad.id as admin_id
        FROM answers a
        JOIN admins ad ON a.admin_id = ad.id
        WHERE a.question_id = ?
        ORDER BY a.created_at ASC
      `, [question.id]);
      
      question.answers = answers;
    }

    res.json(questions);
  } catch (error) {
    console.error('获取问题列表错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取单个问题详情
router.get('/:id', async (req, res) => {
  try {
    const questionId = req.params.id;

    const [questions] = await pool.execute(`
      SELECT 
        q.id,
        q.title,
        q.content,
        q.author_name,
        q.author_email,
        q.created_at,
        q.updated_at
      FROM questions q
      WHERE q.id = ?
    `, [questionId]);

    if (questions.length === 0) {
      return res.status(404).json({ error: '问题不存在' });
    }

    const question = questions[0];

    // 获取该问题的所有回答
    const [answers] = await pool.execute(`
      SELECT 
        a.id,
        a.content,
        a.created_at,
        a.updated_at,
        ad.username as admin_username,
        ad.id as admin_id
      FROM answers a
      JOIN admins ad ON a.admin_id = ad.id
      WHERE a.question_id = ?
      ORDER BY a.created_at ASC
    `, [questionId]);

    question.answers = answers;

    res.json(question);
  } catch (error) {
    console.error('获取问题详情错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 用户提交新问题
router.post('/', [
  body('title').trim().isLength({ min: 5, max: 255 }).withMessage('标题长度应在5-255字符之间'),
  body('content').trim().isLength({ min: 10 }).withMessage('问题内容至少10个字符'),
  body('author_name').trim().isLength({ min: 2, max: 100 }).withMessage('姓名长度应在2-100字符之间'),
  body('author_email').optional().isEmail().withMessage('邮箱格式不正确')
], async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: '输入验证失败', 
        details: errors.array() 
      });
    }

    const { title, content, author_name, author_email } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO questions (title, content, author_name, author_email) VALUES (?, ?, ?, ?)',
      [title, content, author_name, author_email || null]
    );

    res.status(201).json({
      message: '问题提交成功',
      questionId: result.insertId
    });
  } catch (error) {
    console.error('提交问题错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 管理员回复问题
router.post('/:id/answers', authenticateToken, [
  body('content').trim().isLength({ min: 5 }).withMessage('回答内容至少5个字符')
], async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: '输入验证失败', 
        details: errors.array() 
      });
    }

    const questionId = req.params.id;
    const { content } = req.body;
    const adminId = req.user.id;

    // 检查问题是否存在
    const [questions] = await pool.execute(
      'SELECT id FROM questions WHERE id = ?',
      [questionId]
    );

    if (questions.length === 0) {
      return res.status(404).json({ error: '问题不存在' });
    }

    // 添加回答
    const [result] = await pool.execute(
      'INSERT INTO answers (question_id, content, admin_id) VALUES (?, ?, ?)',
      [questionId, content, adminId]
    );

    res.status(201).json({
      message: '回答提交成功',
      answerId: result.insertId
    });
  } catch (error) {
    console.error('提交回答错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 管理员修改回复
router.put('/:questionId/answers/:answerId', authenticateToken, [
  body('content').trim().isLength({ min: 5 }).withMessage('回答内容至少5个字符')
], async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: '输入验证失败', 
        details: errors.array() 
      });
    }

    const questionId = req.params.questionId;
    const answerId = req.params.answerId;
    const { content } = req.body;
    const adminId = req.user.id;

    // 检查回答是否存在且属于当前管理员
    const [answers] = await pool.execute(`
      SELECT id, admin_id FROM answers 
      WHERE id = ? AND question_id = ?
    `, [answerId, questionId]);

    if (answers.length === 0) {
      return res.status(404).json({ error: '回复不存在' });
    }

    const answer = answers[0];
    if (answer.admin_id !== adminId) {
      return res.status(403).json({ error: '只能修改自己的回复' });
    }

    // 更新回答
    await pool.execute(
      'UPDATE answers SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [content, answerId]
    );

    res.json({ message: '回复修改成功' });
  } catch (error) {
    console.error('修改回答错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 管理员删除回复
router.delete('/:questionId/answers/:answerId', authenticateToken, async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const answerId = req.params.answerId;
    const adminId = req.user.id;

    // 检查回答是否存在且属于当前管理员
    const [answers] = await pool.execute(`
      SELECT id, admin_id FROM answers 
      WHERE id = ? AND question_id = ?
    `, [answerId, questionId]);

    if (answers.length === 0) {
      return res.status(404).json({ error: '回复不存在' });
    }

    const answer = answers[0];
    if (answer.admin_id !== adminId) {
      return res.status(403).json({ error: '只能删除自己的回复' });
    }

    // 删除回答
    const [result] = await pool.execute(
      'DELETE FROM answers WHERE id = ?',
      [answerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '回复不存在' });
    }

    res.json({ message: '回复删除成功' });
  } catch (error) {
    console.error('删除回答错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 管理员删除问题
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const questionId = req.params.id;

    const [result] = await pool.execute(
      'DELETE FROM questions WHERE id = ?',
      [questionId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '问题不存在' });
    }

    res.json({ message: '问题删除成功' });
  } catch (error) {
    console.error('删除问题错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router; 