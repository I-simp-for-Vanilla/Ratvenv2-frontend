import logo from '../../assets/logo.png';

export default function Logo({ size = 28 }) {
  return <img src={logo} width={size} height={size} alt="" aria-hidden="true" style={{ display: 'block', objectFit: 'contain' }} />;
}