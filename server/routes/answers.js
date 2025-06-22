const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 管理员修改回复
router.put('/:answerId', authenticateToken, [
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

    const answerId = req.params.answerId;
    const { content } = req.body;
    const adminId = req.user.id;

    // 检查回答是否存在且属于当前管理员
    const [answers] = await pool.execute(`
      SELECT id, admin_id, question_id FROM answers 
      WHERE id = ?
    `, [answerId]);

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

    res.json({ 
      message: '回复修改成功',
      answerId: answerId,
      questionId: answer.question_id
    });
  } catch (error) {
    console.error('修改回答错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 管理员删除回复
router.delete('/:answerId', authenticateToken, async (req, res) => {
  try {
    const answerId = req.params.answerId;
    const adminId = req.user.id;

    // 检查回答是否存在且属于当前管理员
    const [answers] = await pool.execute(`
      SELECT id, admin_id, question_id FROM answers 
      WHERE id = ?
    `, [answerId]);

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

    res.json({ 
      message: '回复删除成功',
      answerId: answerId,
      questionId: answer.question_id
    });
  } catch (error) {
    console.error('删除回答错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router; 