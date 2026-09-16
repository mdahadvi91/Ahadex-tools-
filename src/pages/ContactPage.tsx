import React, { useState } from 'react';
import { PageTransition } from '../components/animations/PageTransition';
import { Reveal } from '../components/animations/Reveal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../context/ToastContext';
import { Mail, MessageSquare, Send, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('tool-suggestion');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      addToast('Missing Fields', 'Please complete all required fields.', 'warning');
      return;
    }

    if (!email.includes('@')) {
      addToast('Invalid Email', 'Please provide a valid email address.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      addToast('Message Dispatched', 'Thank you! Your feedback has been queued.', 'success');
    }, 600);
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Reveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
              <Mail className="w-3.5 h-3.5" />
              <span>Direct Communication Channel</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
              Contact & Tool Requests
            </h1>
            <p className="text-sm sm:text-base text-slate-300/90 mt-3 leading-relaxed">
              Have an idea for a new client-side tool? Encountered a subtle edge case? Reach out to
              our engineering team.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Form */}
          <div className="md:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 shadow-xl">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">Feedback Received</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Thank you for shaping AHADEX TOOLS. Our engineering roadmap reviews every
                    suggestion.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full h-10 px-3.5 rounded-xl glass-input text-xs outline-none focus:border-cyan-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@domain.com"
                      className="w-full h-10 px-3.5 rounded-xl glass-input text-xs outline-none focus:border-cyan-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Topic
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl glass-card text-xs text-slate-200 border border-white/10 outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      <option value="tool-suggestion" className="bg-slate-900">
                        Suggest a New Tool
                      </option>
                      <option value="bug-report" className="bg-slate-900">
                        Report a Bug or Edge Case
                      </option>
                      <option value="performance" className="bg-slate-900">
                        Performance / Wasm Feedback
                      </option>
                      <option value="general" className="bg-slate-900">
                        General Inquiry
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Message & Description
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe the tool or feature you'd like to see..."
                      className="w-full p-3.5 rounded-xl glass-input text-xs outline-none focus:border-cyan-400 resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full"
                    loading={isSubmitting}
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Submit Dispatch
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Side Info */}
          <div className="md:col-span-5 space-y-5">
            <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Feature Suggestions</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We prioritize tools that can execute 100% inside client browsers without server
                dependencies. If you know a WebAssembly or Canvas technique, mention it!
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Frequently Asked</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Have questions regarding our privacy architecture or file limits? Check our FAQ
                accordion.
              </p>
              <Link to="/#faq-section" className="text-xs text-cyan-400 hover:underline block">
                Go to FAQ →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
