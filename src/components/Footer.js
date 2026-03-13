import React from 'react';
import './Footer.css';
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">

                {/* Github 아이콘 + 링크 */}
                <div className="footer-github">
                    <a 
                        href="https://github.com/choi000921/kmjoonggo" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="github-link"
                    >
                        <FaGithub size={28} />
                        <span> Kmjoonggo GitHub</span>
                    </a>
                </div>

                {/* 팀 정보 */}
                <div className="footer-section team">
                    <h4>Development Team</h4>
                    <p>박신배 • 최정현 • 한정욱 • 이성민</p>
                </div>

                {/* 저작권 */}
                <div className="footer-section copy">
                    <p>© {year} Kmjoonggo Team. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
