import styled, { css } from 'styled-components';

const colors = {
    primary: '#4CAF50',    // Main green
    light: '#81C784',      // Light green
    dark: '#388E3C',       // Dark green
    background: '#F1F8E9',  // Very light green background
    text: '#2E7D32',       // Green text
    white: '#FFFFFF'
};

export const Container = styled.div`
    background-color: ${colors.white};
    border-radius: 20px;
    box-shadow: 0 14px 28px rgba(76, 175, 80, 0.15);
    position: relative;
    overflow: hidden;
    width: 1000px;
    max-width: 100%;
    min-height: 680px;
    margin: 50px auto;
`;

export const Form = styled.form`
    background-color: ${colors.white};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    height: 100%;
    text-align: center;
`;

export const Title = styled.h1`
    font-weight: 700;
    margin: 0 0 15px 0;
    color: ${colors.text};
    font-size: 20px;
`;


export const Input = styled.input`
    background-color: #eee;
    border: none;
    border-radius: 8px;
    padding: 12px 15px;
    margin: 8px 0;
    width: 100%;
    font-size: 14px;

    &:focus {
        outline: 1px solid ${colors.light};
    }
`;

export const Button = styled.button`
    background-color: ${colors.primary};
    color: ${colors.white};
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.3s ease;
    cursor: pointer;
    margin-top: 15px;

    &:hover {
        background-color: ${colors.dark};
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

export const Logo = styled.img`
    width: 100px;
    height: auto;
    margin-bottom: 20px;
`;

export const ErrorText = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(231, 76, 60, 0.95);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    z-index: 1000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.5s ease forwards;

    @keyframes slideIn {
        0% {
            opacity: 0;
            transform: translate(-50%, calc(-50% - 20px));
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }
`;

export const SignUpContainer = styled.div.attrs(props => ({
    'data-islogin': props.isLogin
}))`
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
    ${props => !props.isLogin && css`
        transform: translateX(100%);
        opacity: 1;
        z-index: 5;
    `}
`;

export const SignInContainer = styled.div.attrs(props => ({
    'data-islogin': props.isLogin
}))`
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
    left: 0;
    width: 50%;
    z-index: 2;
    ${props => !props.isLogin && css`
        transform: translateX(100%);
    `}
`;

export const OverlayContainer = styled.div.attrs(props => ({
    'data-islogin': props.isLogin
}))`
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.6s ease-in-out;
    z-index: 100;
    ${props => !props.isLogin && css`
        transform: translateX(-100%);
    `}
`;

export const Overlay = styled.div.attrs(props => ({
    'data-islogin': props.isLogin
}))`
    background: ${colors.primary};
    background: linear-gradient(to right, ${colors.light}, ${colors.primary});
    color: ${colors.white};
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
    ${props => !props.isLogin && css`
        transform: translateX(50%);
    `}
`;

export const OverlayPanel = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    text-align: center;
    top: 0;
    height: 100%;
    width: 50%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
`;

export const LeftOverlayPanel = styled(OverlayPanel).attrs(props => ({
    'data-islogin': props.isLogin
}))`
    transform: translateX(-20%);
    ${props => !props.isLogin && css`
        transform: translateX(0);
    `}
`;

export const RightOverlayPanel = styled(OverlayPanel).attrs(props => ({
    'data-islogin': props.isLogin
}))`
    right: 0;
    transform: translateX(0);
    ${props => !props.isLogin && css`
        transform: translateX(20%);
    `}
`;

export const Paragraph = styled.p`
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0.5px;
    margin: 15px 0;
    margin-left: 100px;
    max-width: 80%;
    color: #2c3e50;
`;

export const Text = styled.p`
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.5px;
    margin: 20px 0 30px;
    color: ${colors.white};
`;

export const GhostButton = styled.button`
    background-color: transparent;
    border: 2px solid ${colors.primary};
    border-radius: 8px;
    color: ${colors.primary};
    font-size: 13px;
    font-weight: 600;
    padding: 10px 30px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.3s ease;
    margin-top: 15px;
    margin-left: 100px;
    cursor: pointer;

    &:hover {
        background-color: ${colors.primary};
        color: ${colors.white};
    }
`;