'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useSphere } from '@/context/SphereContext';
import { useSphereContract } from '@/hooks/useSphereContract';

interface RightPanelProps {
  communityId: bigint;
}

export default function RightPanel({ communityId }: RightPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');
  const [message, setMessage] = useState('');

  const { address } = useAccount();
  const contract = useSphereContract();
  const { register, sendMessage, isPending, isConfirming, isSuccess, writeError, resetWrite } = useSphere();

  const { data: memberData, refetch: refetchMember } = useReadContract({
    ...contract,
    functionName: 'members',
    args: address ? [communityId, address] : undefined,
    query: { enabled: !!address },
  });

  const isMember = memberData && Array.isArray(memberData) && memberData[3] !== BigInt(0);

  useEffect(() => {
    if (isSuccess) {
      refetchMember();
      setName('');
      setIntro('');
      setMessage('');
      const timer = setTimeout(() => resetWrite(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, refetchMember, resetWrite]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    register(communityId, name.trim(), intro.trim());
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(communityId, message.trim());
  };

  const isCooldownError = writeError?.message?.includes('12 hours');

  return (
    <div className={`relative bg-bg-panel border-l border-border transition-all duration-300 flex flex-col ${collapsed ? 'w-10' : 'w-[300px]'}`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expand' : 'Collapse'}
        className="absolute top-1/2 -translate-y-1/2 -left-3 bg-bg-card border border-border text-text-secondary w-6 h-12 flex items-center justify-center cursor-pointer text-xs transition-all duration-200 rounded-l-md z-10 hover:bg-accent-dim hover:text-accent hover:border-accent"
      >
        {collapsed ? '◀' : '▶'}
      </button>

      {!collapsed && (
        <div className="p-5 overflow-y-auto flex-1">
          {!address ? (
            <div className="text-center py-8 text-text-muted">
              <p>Connect your wallet to interact</p>
            </div>
          ) : !isMember ? (
            <>
              <h3 className="font-pixel text-[0.6rem] text-accent mb-5 uppercase tracking-widest">Join Community</h3>
              <form onSubmit={handleJoin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-pixel text-[0.45rem] text-text-secondary uppercase tracking-widest">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm outline-none transition-colors focus:border-accent"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-pixel text-[0.45rem] text-text-secondary uppercase tracking-widest">Introduction</label>
                  <textarea
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm outline-none transition-colors focus:border-accent resize-y min-h-[60px]"
                    rows={3}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending || isConfirming}
                  className="px-4 py-3 bg-accent text-black border-none rounded-lg font-pixel text-[0.5rem] cursor-pointer transition-all duration-200 hover:bg-accent-glow hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Confirming...' : isConfirming ? 'Waiting...' : '🌱 Join Community'}
                </button>
                {isSuccess && <p className="text-sm text-accent-glow text-center">Welcome to the community! 🎉</p>}
                {writeError && !isCooldownError && (
                  <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{writeError.message.slice(0, 100)}</p>
                )}
              </form>
            </>
          ) : (
            <>
              <h3 className="font-pixel text-[0.6rem] text-accent mb-5 uppercase tracking-widest">Send Message</h3>
              <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message..."
                    className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm outline-none transition-colors focus:border-accent resize-y min-h-[80px]"
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending || isConfirming}
                  className="px-4 py-3 bg-accent text-black border-none rounded-lg font-pixel text-[0.5rem] cursor-pointer transition-all duration-200 hover:bg-accent-glow hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Confirming...' : isConfirming ? 'Sending...' : '💬 Send Message'}
                </button>
                {isSuccess && <p className="text-sm text-accent-glow text-center">Message sent! 📨</p>}
                {isCooldownError && (
                  <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 px-3 py-3 rounded-lg text-yellow-400 text-sm">
                    <span className="text-xl">⏳</span>
                    <p>You need to wait 12 hours between messages.</p>
                  </div>
                )}
                {writeError && !isCooldownError && (
                  <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{writeError.message.slice(0, 100)}</p>
                )}
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
