/**
 * Logo "desafioo", desenhado no Figma pelo dono do produto. Caminhos
 * copiados exatamente do SVG original; só as cores viram tokens do
 * STYLE.md: preto = tinta (currentColor, herda de `text-ink`) e
 * #DEDEDE = cinza-painel. Proporção fixa pelo viewBox (66x10): largura
 * pelo className, altura automática, nunca distorce.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 66 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="desafioo"
      className={`h-auto text-ink ${className}`}
    >
      <path
        d="M0 9.625V0H6.875V1.375H8.25V2.75H9.36015V5V6.875H8.25V8.25H6.875V9.625H0ZM2.75 8.25H5.5V6.875H6.875V2.75H5.5V1.375H2.75V8.25Z"
        fill="currentColor"
      />
      <path
        d="M10.9591 9.625V8.25H10V6.1875V4.125H10.9591V2.75H17.0967V4.125H18.3243V6.875H12.1866V8.25H17.0967V9.625H10.9591ZM12.1866 5.5H15.8692V4.125H12.1866V5.5Z"
        fill="currentColor"
      />
      <path
        d="M19 9.625V8.25H25.875V6.875L19.8526 6.79267V5.5H19V4.125H19.8526V2.75H27.25V4.125H21.0673V5.5H27.25V6.875H28.1294V8.25H27.25V9.625H19Z"
        fill="currentColor"
      />
      <path
        d="M29.5838 9.625V8.25H28.7482V6.875H29.5838V5.5H35.0838V4.125H29.5838V2.75H36.4588V4.125H37.5V9.625H29.5838ZM30.9588 8.25H35.0838V6.875H30.9588V8.25Z"
        fill="currentColor"
      />
      <path
        d="M39.25 9.625V4.125H38.1636V2.75H39.25V1.375H40.625V0H44.75V1.375H42V2.75H47.5V9.625H44.75V4.125H42V9.625H39.25Z"
        fill="currentColor"
      />
      <path
        d="M50.4428 8.75V7.75H49.3V4.75H50.4428V3.75H56.1571V4.75H57.3V7.75H56.1571V8.75H50.4428ZM51.8397 7.75H55.1559V4.75H51.8397V7.75Z"
        fill="var(--color-cinza-painel)"
      />
      <path d="M51.8397 7.75H55.1559V4.75H51.8397V7.75Z" fill="currentColor" />
      <path
        d="M56.6574 3.25V4.25H57.8V8.25H56.6574V9.25H49.9426V8.25H48.8V4.25H49.9426V3.25H56.6574Z"
        stroke="currentColor"
      />
      <path
        d="M57.23 8.75V8.02778V7.30556H56.8079H56.5112L56.5113 5.08333H56.8079H57.23V4.41941V3.75H63.1571V4.75H64.3V7.75H63.1571V8.75H57.23ZM59.4746 7.75H62.9032V4.75H59.4746V7.75Z"
        fill="var(--color-cinza-painel)"
      />
      <path d="M59.4746 7.75H62.9032V4.75H59.4746V7.75Z" fill="currentColor" />
      <path
        d="M63.6568 3.25V4.25H64.8003V8.25H63.6568V9.25H56.73V7.80566H56.0113V4.58301H56.73V3.25H63.6568Z"
        stroke="currentColor"
      />
    </svg>
  );
}
