import React from 'react';

const SmartAskPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold mb-8 text-blue-700 text-center border-b-2 border-blue-200 pb-4">
          提问指南
        </h1>
        
        <div className="prose prose-lg prose-blue max-w-none">
          {/* 版权信息 */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong className="text-blue-900">原文出处：</strong> 
              <a href="https://lug.ustc.edu.cn/wiki/doc/howtoask/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline ml-1">
                LUG @ USTC 提问指南
              </a>
              <br />
              <strong className="text-blue-900">许可证：</strong> 
              <span className="ml-1">CC-BY-NC-SA 4.0</span>
            </p>
          </div>

          {/* 目录 */}
          <div className="mb-10 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">📋 目录</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="pl-2">• 为什么需要再写一份这样的指南</li>
              <li className="pl-2">• 提问之前
                <ul className="mt-2 ml-6 space-y-1 text-gray-600">
                  <li>◦ 阅读已有的信息</li>
                  <li>◦ 利用搜索引擎等工具</li>
                  <li>◦ 其他信息</li>
                </ul>
              </li>
              <li className="pl-2">• 提问时的注意事项
                <ul className="mt-2 ml-6 space-y-1 text-gray-600">
                  <li>◦ 避免 X-Y 型问题</li>
                  <li>◦ 直接提问，避免使用「在吗」/「有人吗」</li>
                  <li>◦ 避免「有没有人懂」</li>
                  <li>◦ 尽可能提供「最小可复现样例」</li>
                  <li>◦ 提供必要的问题描述与相关信息</li>
                  <li>◦ 使用代码片段服务分享问题相关的代码与报错</li>
                  <li>◦ 避免拍屏</li>
                </ul>
              </li>
              <li className="pl-2">• 无人应答</li>
              <li className="pl-2">• 附录：如何正确向大语言模型提问</li>
            </ul>
          </div>

          {/* 主要内容部分 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-300 pb-2">
              🤔 为什么需要再写一份这样的指南
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>网上已经有一些关于如何提问的文档，例如：</p>
              <ul className="ml-6 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>提问的智慧（原文，中文）</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>别傻傻地提问</span>
                </li>
              </ul>
              <p>本文不是这些文档的翻版。我们希望通过更加简洁、清晰、友好的语言，帮助同学们快速了解提问注意事项。</p>
              <p className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <strong>💡 重要说明：</strong>本文涉及到的真实例子会做匿名化处理。我们希望读者在遇到类似问题时，能够结合自己的实际情况进行思考，而不是机械地执行检查单。
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-300 pb-2">
              🔍 提问之前
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              在求助他人之前，不妨先自己分析一下问题，这样既能问得更准确，节省他人时间，也能加深对问题的理解。
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="text-blue-500 mr-2">📖</span>
                  阅读已有的信息
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>多数错误伴随着错误信息（error message），这是解决问题的第一步。想要帮助你的人通常也需要这些信息，所以不妨自己先行阅读它们。一些基本的技巧包括：</p>
                  <ul className="ml-6 space-y-3">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>错误信息多为英文，不过无需担心，开发者通常不会使用太复杂的语法或词汇（不妨这样想：很多开发者的英文水平可能并不如你）</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>程序日志一般分为 info、warn（warning、W）、error（E）等级别。通常情况下，请优先关注<strong className="bg-red-100 px-2 py-1 rounded text-red-800">第一个出现的 error/warning</strong> 信息，因为后续错误往往只是前面的延伸。</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>如果你不知道在哪里找到日志，那么建议先解决日志的问题，毕竟没有这些信息，其他人也只能摸着水晶球来猜测到底发生什么了。</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="text-blue-500 mr-2">🔍</span>
                  利用搜索引擎等工具
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>在提问之前，建议先尝试自己搜索解决方案。一些建议：</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">搜索引擎</h4>
                      <p className="text-sm text-blue-700">Google、Bing、百度等</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">官方文档</h4>
                      <p className="text-sm text-green-700">项目手册、FAQ等信息</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">关键词优化</h4>
                      <p className="text-sm text-purple-700">使用合适的查询关键词</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">结果筛选</h4>
                      <p className="text-sm text-orange-700">筛选和验证搜索结果</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-300 pb-2">
              ⚠️ 提问时的注意事项
            </h2>
            
            <div className="space-y-8">
              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
                <h3 className="text-xl font-semibold mb-3 text-red-800 flex items-center">
                  <span className="mr-2">🚫</span>
                  避免 X-Y 型问题
                </h3>
                <p className="text-red-700 leading-relaxed">
                  X-Y 型问题是指你遇到了问题 X，但你认为解决方案是 Y，所以你问的是如何实现 Y，而不是如何解决 X。这往往会导致你得到错误的答案。
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
                <h3 className="text-xl font-semibold mb-3 text-blue-800 flex items-center">
                  <span className="mr-2">💬</span>
                  直接提问，避免使用「在吗」/「有人吗」
                </h3>
                <p className="text-blue-700 leading-relaxed">
                  直接描述你的问题，不要先问"在吗"或"有人吗"。这样可以让看到问题的人立即了解你的需求。
                </p>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                <h3 className="text-xl font-semibold mb-3 text-yellow-800 flex items-center">
                  <span className="mr-2">❓</span>
                  避免「有没有人懂」
                </h3>
                <p className="text-yellow-700 leading-relaxed">
                  不要问"有没有人懂XXX"，直接描述你的具体问题。这样更容易得到有针对性的帮助。
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
                <h3 className="text-xl font-semibold mb-3 text-green-800 flex items-center">
                  <span className="mr-2">🔬</span>
                  尽可能提供「最小可复现样例」
                </h3>
                <p className="text-green-700 leading-relaxed">
                  提供一个能够重现问题的最小代码示例，这样可以帮助他人更好地理解你的问题。
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400">
                <h3 className="text-xl font-semibold mb-3 text-purple-800 flex items-center">
                  <span className="mr-2">📝</span>
                  提供必要的问题描述与相关信息
                </h3>
                <div className="text-purple-700 leading-relaxed">
                  <p className="mb-3">包括但不限于：</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>操作系统和版本</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>相关软件的版本</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>完整的错误信息</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>已尝试的解决方案</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-400">
                <h3 className="text-xl font-semibold mb-3 text-indigo-800 flex items-center">
                  <span className="mr-2">📋</span>
                  使用代码片段服务分享问题相关的代码与报错
                </h3>
                <div className="text-indigo-700 leading-relaxed">
                  <p className="mb-3">对于长代码或错误信息，建议使用代码片段服务：</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      <span>GitHub Gist</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      <span>GitLab Snippets</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      <span>Pastebin 类服务</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
                <h3 className="text-xl font-semibold mb-3 text-red-800 flex items-center">
                  <span className="mr-2">📸</span>
                  避免拍屏
                </h3>
                <div className="text-red-700 leading-relaxed">
                  <p className="mb-3">除非实在无法截图（例如系统启动阶段），否则不要拍屏，因为：</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>不美观</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>因为莫尔纹现象，字/图像可能会拍不清楚</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>其他人可能得歪着头才能看清内容</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>不利于其他人搜索类似问题</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-300 pb-2">
              🤷‍♂️ 无人应答
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed mb-4">
                  没人回答问题不等于被无视。在群聊中，认真提问却无人回应，往往只是因为看到问题的人都不知道答案罢了。也要注意，群聊或论坛里的陌生人并没有义务回答你的问题。
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">可以考虑以下解决方式：</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>线下咨询</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>向对应服务/软件的维护人员提交工单</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>在相关论坛或社区发帖</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-300 pb-2">
              🤖 附录：如何正确向大语言模型提问
            </h2>
            
            <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-400 mb-6">
              <h3 className="text-lg font-semibold mb-2 text-amber-800">
                ⚠️ 请先阅读正文内容，再阅读本部分
              </h3>
              <p className="text-amber-700">
                对人类有效的提问策略，大多对大语言模型（LLM）也有效。
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">
                  📚 提供足够的上下文信息
                </h3>
                <p className="text-blue-700 leading-relaxed">
                  和向人类提问类似，提供足够的上下文信息可以更好帮助大语言模型理解问题，给出更好的回答。
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
                <h3 className="text-lg font-semibold mb-3 text-green-800">
                  🌐 提问语言
                </h3>
                <p className="text-green-700 leading-relaxed">
                  在大语言模型的训练语料中往往英文占比更高，因此用英文提问可能效果更好。国产的大语言模型可能可以缓解这个问题。
                </p>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-400">
                <h3 className="text-lg font-semibold mb-3 text-orange-800">
                  ⏱️ 避免超长的对话
                </h3>
                <div className="text-orange-700 leading-relaxed space-y-3">
                  <p>大语言模型的工作模式很简单：每次用户发送消息时，LLM 都会从头分析内容，直到用户本次信息结束才开始生成。这带来了两个问题：</p>
                  <div className="space-y-2 ml-4">
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">1.</span>
                      <span>对于超长的对话，每一次继续对话都会浪费不少的钱</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">2.</span>
                      <span>相比于短文本，LLM 对长文本更容易产生「幻觉」，即输出与实际情况不相符的内容</span>
                    </div>
                  </div>
                  <div className="bg-orange-100 p-4 rounded-lg mt-4">
                    <p className="font-medium">💡 建议：</p>
                    <p>如果发现 LLM 工作异常，可以重启会话。重新开始后，更应该调整提问的策略。</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="my-8 border-gray-300" />
          
          {/* 页脚信息 */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-800 mb-1">📄 原文链接</p>
                <a href="https://lug.ustc.edu.cn/wiki/doc/howtoask/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline break-all">
                  https://lug.ustc.edu.cn/wiki/doc/howtoask/
                </a>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">📅 更新时间</p>
                <p>2025年4月17日</p>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">©️ 版权声明</p>
                <p>本文内容来自中国科学技术大学 Linux 用户协会（LUG @ USTC），采用 CC-BY-NC-SA 4.0 许可证。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartAskPage; 