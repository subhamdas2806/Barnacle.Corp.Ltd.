import React, { useState } from 'react';
import { HardDrive, Github, Linkedin, Twitter, Mail, Award, FileCode, Send, CheckCircle2 } from 'lucide-react';

export default function MySystem() {
  const [activeTab, setActiveTab] = useState('HOME');
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });

  const handleDownloadResume = () => {
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html>
        <head>
          <title>Subham Das - Resume</title>
          <style>
            body { font-family: 'Georgia', serif; padding: 40px; color: #111; line-height: 1.5; }
            h1 { font-size: 28px; margin-bottom: 4px; }
            .subtitle { font-size: 14px; color: #444; margin-bottom: 20px; }
            h2 { font-size: 18px; border-bottom: 2px solid #000; padding-bottom: 4px; margin-top: 24px; }
            .item-head { font-weight: bold; display: flex; justify-content: space-between; }
            ul { margin-top: 4px; padding-left: 20px; }
          </style>
        </head>
        <body>
          <h1>SUBHAM DAS</h1>
          <div class="subtitle">B.Tech CSE (AI/ML) · NIMS University, Jaipur | Delhi, India | dassubham7756@gmail.com | github.com/subhamdas2806</div>
          
          <h2>EXPERIENCE</h2>
          <div class="item-head"><span>Product Manager — SheCan Foundation (Remote)</span><span>Aug 2026 – Present</span></div>
          <ul><li>Driving product strategy and coordinating cross-functional efforts to deliver impact-driven digital solutions.</li></ul>
          <div class="item-head"><span>Web Development Intern — InAmigos Foundation (Remote)</span><span>Jun – Jul 2026</span></div>
          <ul><li>Built and maintained web-based tools and front-end features for foundation platforms.</li></ul>

          <h2>PROJECTS</h2>
          <div><strong>Aether Launcher — C# · WinUI 3 · SQLite</strong> (2026)</div>
          <ul><li>Built a Windows desktop launcher for offline games using .NET 8, WinUI 3, and SteamGridDB API integration.</li></ul>
          <div><strong>smallbrowser — C# · WebView2</strong> (2026)</div>
          <ul><li>Lightweight embeddable browser wrapper around Microsoft Edge WebView2.</li></ul>
          <div><strong>Pong AI (NEAT) — Python · NEAT · Pygame</strong> (2026)</div>
          <ul><li>Trained AI agents to play Pong autonomously using NeuroEvolution.</li></ul>
          <div><strong>CHIP-8 Emulator — C / C++</strong> (2025)</div>
          <ul><li>Fully functional CHIP-8 emulator decoding 35 opcodes with cycle-accurate timing.</li></ul>
          
          <h2>EDUCATION</h2>
          <div class="item-head"><span>B.Tech — Computer Science & Engineering (AI/ML)</span><span>2024 – 2028 (Expected)</span></div>
          <div>NIMS University, Jaipur (Grade: 9.56 CGPA)</div>
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.print();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', email: '', company: '', message: '' });
    }, 4000);
  };

  // Minimal Home Page (Matching Image 3)
  if (activeTab === 'HOME') {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          position: 'relative'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1
            style={{
              fontFamily: 'var(--font-retro-header)',
              fontSize: 58,
              fontWeight: 900,
              letterSpacing: 2,
              color: '#000000',
              lineHeight: 1,
              marginBottom: 12
            }}
          >
            BARNACLE SCUM
          </h1>
          <h2
            className="pixel-distort"
            style={{
              fontSize: 28,
              fontWeight: 'normal',
              color: '#222222',
              marginTop: 4
            }}
          >
            Corporate Limited
          </h2>
        </div>

        {/* Minimal Link Navigation Menu */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {['ABOUT', 'EXPERIENCE', 'EDUCATION', 'PROJECTS', 'CONTACT'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--win-link)',
                fontFamily: 'var(--font-system)',
                fontSize: 14,
                fontWeight: 'bold',
                textDecoration: 'underline',
                cursor: 'pointer',
                letterSpacing: 1
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--win-link-hover)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--win-link)')}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bottom Footer Copyright */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 16,
            fontSize: 11,
            color: '#666666',
            fontFamily: 'var(--font-system)'
          }}
        >
          © 2026 Barnacle Systems
        </div>
      </div>
    );
  }

  // Section Pages with Left Sidebar Navigation (Matching Image 1 & Image 2)
  return (
    <div className="explorer-container">
      {/* Sidebar Navigation */}
      <div className="explorer-sidebar">
        <div>
          <div className="explorer-logo" style={{ fontFamily: 'var(--font-retro-header)', fontSize: 20 }}>
            BARNACLE<br />SCUM
          </div>
          <div className="explorer-version" style={{ fontFamily: 'var(--font-retro-sub)' }}>
            v1.0
          </div>
        </div>

        <nav className="explorer-nav">
          {['HOME', 'ABOUT', 'EXPERIENCE', 'EDUCATION', 'PROJECTS', 'CERTIFICATIONS', 'CONTACT'].map((tab) => (
            <button
              key={tab}
              className={`explorer-nav-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <span>{activeTab === tab ? 'o' : ' '}</span>
              <span>{tab}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Pane */}
      <div className="explorer-content">
        {/* Floppy Disk Header Banner */}
        <div className="explorer-header-box">
          <HardDrive size={24} color="#555555" />
          <div>
            <span style={{ fontWeight: 'bold', fontSize: 14, fontFamily: 'var(--font-retro-sub)' }}>
              Looking for my resume?
            </span>{' '}
            <span className="resume-download-link" onClick={handleDownloadResume}>
              Click here to download it!
            </span>
          </div>
        </div>

        {/* Tab: ABOUT */}
        {activeTab === 'ABOUT' && (
          <div>
            <h1 className="retro-title" style={{ fontFamily: 'var(--font-retro-header)', fontSize: 48 }}>
              System Online
            </h1>
            <p className="retro-subtitle pixel-distort" style={{ fontSize: 24, margin: '8px 0 16px 0' }}>
              I'm DELTAOS Admin
            </p>

            <p style={{ fontSize: 13.5, marginBottom: 14, color: '#222' }}>
              I'm a digitized consciousness currently living in the cloud!
            </p>

            <p style={{ marginBottom: 24, color: '#333', fontSize: 13 }}>
              Thank you for accessing my terminal. I really hope you enjoy exploring the system. If you have any bugs to report, feel free to ping me using{' '}
              <span className="resume-download-link" onClick={() => setActiveTab('CONTACT')}>this uplink</span> or shoot me a packet at{' '}
              <a href="mailto:dassubham7756@gmail.com" style={{ color: 'var(--win-link)', fontWeight: 'bold' }}>
                dassubham7756@gmail.com
              </a>.
            </p>

            <h2 style={{ fontFamily: 'var(--font-retro-header)', fontSize: 28, marginBottom: 14 }}>About Me</h2>
            
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
              <div
                className="win-outset"
                style={{
                  width: 180,
                  height: 220,
                  padding: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#eaeaea'
                }}
              >
                <div
                  className="win-inset"
                  style={{
                    width: 160,
                    height: 180,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#008080'
                  }}
                >
                  <div style={{ textAlign: 'center', color: '#fff', padding: 12 }}>
                    <div style={{ fontSize: 48 }}>👨‍💻</div>
                    <div style={{ fontSize: 12, fontWeight: 'bold', marginTop: 8 }}>Subham Das</div>
                    <div style={{ fontSize: 10 }}>AI/ML & Systems</div>
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 260 }}>
                <p style={{ marginBottom: 14, fontSize: 13.5, lineHeight: 1.6 }}>
                  From a young age, curiosity about how things work led me down the path of technology. This evolved into a passion for programming and Artificial Intelligence, where I now focus on building intelligent systems that solve real-world problems using tools like machine learning and cloud computing.
                </p>
                <p style={{ marginBottom: 14, fontSize: 13.5, lineHeight: 1.6 }}>
                  Currently a student at NIMS University, Jaipur (B.Tech CSE AI/ML), I specialize in C++, Java, C#, and Python with a strong focus on AI development. My technical portfolio includes building projects like <strong>Aether Launcher</strong>, <strong>smallbrowser</strong>, <strong>Pong AI (NEAT)</strong>, and <strong>CHIP-8 Emulator</strong>.
                </p>
              </div>
            </div>

            <h2 style={{ fontFamily: 'var(--font-retro-header)', fontSize: 24, marginBottom: 12, marginTop: 24 }}>
              Technical Skills Matrix
            </h2>
            <div className="win-inset-gray" style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div>
                <strong style={{ color: '#000080' }}>💻 Languages</strong>
                <p style={{ marginTop: 4 }}>Python, C, C++, C#</p>
              </div>
              <div>
                <strong style={{ color: '#000080' }}>🤖 AI / ML</strong>
                <p style={{ marginTop: 4 }}>NEAT (NeuroEvolution), spaCy, NumPy, Pandas, Pygame</p>
              </div>
              <div>
                <strong style={{ color: '#000080' }}>🌐 Web & Desktop</strong>
                <p style={{ marginTop: 4 }}>HTML, CSS, React, Django, WinUI 3, WebView2</p>
              </div>
              <div>
                <strong style={{ color: '#000080' }}>🗄️ Cloud & Databases</strong>
                <p style={{ marginTop: 4 }}>SQLite, MySQL, MongoDB, PostgreSQL, AWS</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: EXPERIENCE */}
        {activeTab === 'EXPERIENCE' && (
          <div>
            <h1 className="retro-title" style={{ fontFamily: 'var(--font-retro-header)', fontSize: 44 }}>
              The Rust Programming Language
            </h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <span style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>Open Source Contributor</span>
              <span style={{ fontSize: 13, fontWeight: 'bold', color: '#444' }}>Oct 2025 – Present</span>
            </div>
            <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
              Diagnosed and resolved 6+ Internal Compiler Errors (ICEs) within the <em>rustc</em> compiler, fixing crashes. Modernized the compiler's test infrastructure by migrating 40+ legacy UI tests to the new framework, reducing manual testing time by ~40%.
            </p>
            <div style={{ fontSize: 12, color: '#444', fontWeight: 'bold', marginBottom: 28 }}>
              Skills: Rust · C++ · Python · Makefile · CI/CD
            </div>

            <hr style={{ borderColor: '#c0c0c0', margin: '20px 0' }} />

            <h1 className="retro-title" style={{ fontFamily: 'var(--font-retro-header)', fontSize: 44 }}>
              Campus Mantri
            </h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <span style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>GeeksforGeeks (Part-time)</span>
              <span style={{ fontSize: 13, fontWeight: 'bold', color: '#444' }}>Aug 2025 – Present</span>
            </div>
            <p style={{ marginBottom: 28, lineHeight: 1.6 }}>
              Spearheading student engagement initiatives to foster a vibrant coding culture on campus. Organizing coding contests and technical workshops to bridge the gap between academic learning and industry standards.
            </p>

            <hr style={{ borderColor: '#c0c0c0', margin: '20px 0' }} />

            <h2 style={{ fontFamily: 'var(--font-retro-header)', fontSize: 32, marginBottom: 4 }}>
              Product Manager
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: 8 }}>
              <span>SheCan Foundation (Remote)</span>
              <span style={{ color: '#555' }}>Aug 2026 – Present</span>
            </div>
            <p style={{ marginBottom: 20 }}>
              Driving product strategy and coordinating cross-functional efforts to deliver impact-driven digital solutions.
            </p>

            <h2 style={{ fontFamily: 'var(--font-retro-header)', fontSize: 32, marginBottom: 4 }}>
              Web Development Intern
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: 8 }}>
              <span>InAmigos Foundation (Remote)</span>
              <span style={{ color: '#555' }}>Jun – Jul 2026</span>
            </div>
            <p>
              Built and maintained web-based tools and front-end features for digital platforms, collaborating with a remote engineering team.
            </p>
          </div>
        )}

        {/* Tab: EDUCATION */}
        {activeTab === 'EDUCATION' && (
          <div>
            <h1 className="retro-title" style={{ fontFamily: 'var(--font-retro-header)', fontSize: 48 }}>
              Education
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 16 }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-retro-header)', fontSize: 38, fontWeight: 900, marginBottom: 4 }}>
                  Vellore Institute of Technology / NIMS
                </h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 14, marginBottom: 6 }}>
                  <span>BTech, Computer Science & Engineering (AI/ML)</span>
                  <span style={{ color: '#555' }}>Jul 2024 – 2028</span>
                </div>
                <div className="win-inset-gray" style={{ padding: '6px 12px', display: 'inline-block', fontWeight: 'bold', color: '#000080' }}>
                  Grade: 9.56 CGPA
                </div>
              </div>

              <hr style={{ borderColor: '#c0c0c0' }} />

              <div>
                <h2 style={{ fontFamily: 'var(--font-retro-header)', fontSize: 38, fontWeight: 900, marginBottom: 4 }}>
                  Kendriya Vidyalaya
                </h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 14, marginBottom: 6 }}>
                  <span>AISSCE</span>
                  <span style={{ color: '#555' }}>Apr 2022 – Mar 2024</span>
                </div>
                <div className="win-inset-gray" style={{ padding: '6px 12px', display: 'inline-block', fontWeight: 'bold', color: '#000080' }}>
                  Grade: 95.8%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: PROJECTS */}
        {activeTab === 'PROJECTS' && (
          <div>
            <h1 className="retro-title" style={{ fontFamily: 'var(--font-retro-header)', fontSize: 48 }}>
              Projects
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div className="win-outset" style={{ padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-retro-header)', fontSize: 24, fontWeight: 900, color: '#000' }}>
                    Aether Launcher
                  </h3>
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: '#000080', margin: '4px 0 10px 0' }}>
                    C# · WinUI 3 · SQLite · .NET 8
                  </div>
                  <p style={{ fontSize: 12.5, lineHeight: 1.5, color: '#333' }}>
                    Built a Windows desktop launcher for offline games with SQLite metadata storage, playtime tracking, and SteamGridDB API integration.
                  </p>
                </div>
                <div style={{ marginTop: 14, paddingTop: 8, borderTop: '1px solid #808080', display: 'flex', justifyContent: 'flex-end' }}>
                  <a href="https://github.com/subhamdas2806" target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--win-link)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Github size={14} /> View Code
                  </a>
                </div>
              </div>

              <div className="win-outset" style={{ padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-retro-header)', fontSize: 24, fontWeight: 900, color: '#000' }}>
                    smallbrowser
                  </h3>
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: '#000080', margin: '4px 0 10px 0' }}>
                    C# · WebView2 · WinUI 3
                  </div>
                  <p style={{ fontSize: 12.5, lineHeight: 1.5, color: '#333' }}>
                    Lightweight embeddable browser wrapper around Microsoft Edge WebView2 to cut RAM usage.
                  </p>
                </div>
                <div style={{ marginTop: 14, paddingTop: 8, borderTop: '1px solid #808080', display: 'flex', justifyContent: 'flex-end' }}>
                  <a href="https://github.com/subhamdas2806" target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--win-link)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Github size={14} /> View Code
                  </a>
                </div>
              </div>

              <div className="win-outset" style={{ padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-retro-header)', fontSize: 24, fontWeight: 900, color: '#000' }}>
                    Pong AI (NEAT)
                  </h3>
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: '#000080', margin: '4px 0 10px 0' }}>
                    Python · NEAT · Pygame
                  </div>
                  <p style={{ fontSize: 12.5, lineHeight: 1.5, color: '#333' }}>
                    Trained AI agents to play Pong autonomously using NeuroEvolution. Shipped CRT retro UI and cut training loop time ~25x.
                  </p>
                </div>
                <div style={{ marginTop: 14, paddingTop: 8, borderTop: '1px solid #808080', display: 'flex', justifyContent: 'flex-end' }}>
                  <a href="https://github.com/subhamdas2806" target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--win-link)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Github size={14} /> View Code
                  </a>
                </div>
              </div>

              <div className="win-outset" style={{ padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-retro-header)', fontSize: 24, fontWeight: 900, color: '#000' }}>
                    CHIP-8 Emulator
                  </h3>
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: '#000080', margin: '4px 0 10px 0' }}>
                    C / C++ · Low-Level Systems
                  </div>
                  <p style={{ fontSize: 12.5, lineHeight: 1.5, color: '#333' }}>
                    CHIP-8 emulator from scratch, decoding 35 opcodes with cycle-accurate timing, 4KB memory layout, 64×32 display.
                  </p>
                </div>
                <div style={{ marginTop: 14, paddingTop: 8, borderTop: '1px solid #808080', display: 'flex', justifyContent: 'flex-end' }}>
                  <a href="https://github.com/subhamdas2806" target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--win-link)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Github size={14} /> View Code
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: CERTIFICATIONS */}
        {activeTab === 'CERTIFICATIONS' && (
          <div>
            <h1 className="retro-title" style={{ fontFamily: 'var(--font-retro-header)', fontSize: 44 }}>
              Certifications & Achievements
            </h1>

            <div className="win-inset-gray" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Award size={24} color="#000080" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ fontSize: 14 }}>Runner-Up, NIMS Ideathon 2025</strong>
                  <p style={{ fontSize: 12, color: '#444', marginTop: 2 }}>
                    Led team and presented BeaconLink, an off-grid mesh-network walkie-talkie device.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Award size={24} color="#000080" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ fontSize: 14 }}>Runner-Up, NIMS Hackathon 2025</strong>
                  <p style={{ fontSize: 12, color: '#444', marginTop: 2 }}>
                    Led team and presented AI-based certificate authentication system.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <FileCode size={24} color="#000080" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ fontSize: 14 }}>Freelance AI Image Generation (Fiverr)</strong>
                  <p style={{ fontSize: 12, color: '#444', marginTop: 2 }}>
                    Stable Diffusion & ComfyUI workflows for custom AI output generation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: CONTACT */}
        {activeTab === 'CONTACT' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <h1 className="retro-title" style={{ fontFamily: 'var(--font-retro-header)', fontSize: 48, marginBottom: 0 }}>
                Contact
              </h1>
              <div style={{ display: 'flex', gap: 10 }}>
                <a href="https://github.com/subhamdas2806" target="_blank" rel="noreferrer" className="win-outset-btn" style={{ padding: 4 }}>
                  <Github size={20} color="#000" />
                </a>
                <a href="https://linkedin.com/in/subhamdas06" target="_blank" rel="noreferrer" className="win-outset-btn" style={{ padding: 4 }}>
                  <Linkedin size={20} color="#0077b5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="win-outset-btn" style={{ padding: 4 }}>
                  <Twitter size={20} color="#1da1f2" />
                </a>
              </div>
            </div>

            <p style={{ margin: '14px 0', fontSize: 13 }}>
              If you have any opportunities, feel free to reach out – I would love to chat! You can reach me via my personal email, or fill out the form below!
            </p>

            <p style={{ fontWeight: 'bold', marginBottom: 16 }}>
              Email:{' '}
              <a href="mailto:dassubham7756@gmail.com" style={{ color: 'var(--win-link)', textDecoration: 'underline' }}>
                dassubham7756@gmail.com
              </a>
            </p>

            {formSent ? (
              <div className="win-inset-gray" style={{ padding: 20, textAlign: 'center', color: '#008000' }}>
                <CheckCircle2 size={32} style={{ marginBottom: 8 }} />
                <h3 style={{ fontSize: 16, fontWeight: 'bold' }}>Packet Delivered!</h3>
                <p style={{ fontSize: 12, marginTop: 4 }}>Thank you for reaching out. I'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <label style={{ fontWeight: 'bold', display: 'block' }}>* Your name:</label>
                <input
                  type="text"
                  className="win-inset win-input"
                  placeholder="Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <label style={{ fontWeight: 'bold', display: 'block' }}>* Email:</label>
                <input
                  type="email"
                  className="win-inset win-input"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <label style={{ fontWeight: 'bold', display: 'block' }}>Company (optional):</label>
                <input
                  type="text"
                  className="win-inset win-input"
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />

                <label style={{ fontWeight: 'bold', display: 'block' }}>* Message:</label>
                <textarea
                  className="win-inset win-textarea"
                  placeholder="Message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <button type="submit" className="win-outset-btn" style={{ padding: '6px 20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Send size={14} /> Send Message
                  </button>
                  <span style={{ fontSize: 11, color: '#555' }}>
                    All messages get forwarded straight to my personal email | * = required
                  </span>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
