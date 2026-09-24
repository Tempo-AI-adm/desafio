/**
 * O mascote do app: o par de olhinhos do logo "desafioo". Caminhos
 * copiados exatamente dos SVGs do Figma (desafio-MKT/olhoaberto.svg e
 * olhofechado.svg); só as cores viram tokens do STYLE.md (preto = tinta
 * via currentColor, #DEDEDE = cinza-painel). Os filtros de sombra do
 * Figma ficaram de fora: eram deslocamento zero sem desfoque (não
 * apareciam) e o STYLE.md proíbe sombra difusa.
 *
 * `animado` (decoração): pisca (troca seca aberto→fechado, ~150ms, a
 * cada ~4,5s e ~5,5s alternados) e sobe e desce de leve. Só pra quem não
 * pediu menos movimento no sistema. Sem `animado` (ex: botão de reação
 * do feed): ícone parado, olho aberto.
 */
export function Olhinhos({ altura = 10, animado = false }: { altura?: number; animado?: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 text-ink ${animado ? "motion-safe:animate-[olhinhos-flutuar_2.4s_ease-in-out_infinite]" : ""}`}
    >
      <svg
        viewBox="0 0 23 9"
        width={(altura * 23) / 9}
        height={altura}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className={animado ? "motion-safe:animate-[olhinhos-aberto_10s_linear_infinite]" : ""}>
          <path
            d="M2.4071 7.23377V5.98701H1V2.24675H2.4071V1H9.44261V2.24675H10.8497V5.98701H9.44261V7.23377H2.4071ZM4.77337 5.98701H9.01877V2.24675H4.77337V5.98701Z"
            fill="var(--color-cinza-painel)"
          />
          <path d="M4.77337 5.98701H9.01877V2.24675H4.77337V5.98701Z" fill="currentColor" />
          <path
            d="M9.94238 0.5V1.74707H11.3496V6.4873H9.94238V7.7334H1.90723V6.4873H0.5V1.74707H1.90723V0.5H9.94238Z"
            stroke="currentColor"
          />
          <path
            d="M12.5965 7.23377V6.33333V5.4329H12.0768H11.7116L11.7116 2.66234H12.0768H12.5965V1.83458V1H19.8941V2.24675H21.3012V5.98701H19.8941V7.23377H12.5965ZM15.3601 5.98701H19.5814V2.24675H15.3601V5.98701Z"
            fill="var(--color-cinza-painel)"
          />
          <path d="M15.3601 5.98701H19.5814V2.24675H15.3601V5.98701Z" fill="currentColor" />
          <path
            d="M20.3942 0.5V1.74707H21.8014V6.4873H20.3942V7.7334H12.0963V5.93262H11.2116V2.16211H12.0963V0.5H20.3942Z"
            stroke="currentColor"
          />
        </g>
        {animado ? (
          <g className="opacity-0 motion-safe:animate-[olhinhos-fechado_10s_linear_infinite]">
            <path
              d="M2.40343 7.03899V5.8312H1V2.20782H2.40343V1.00003H9.42059V2.20782H10.824V5.8312H9.42059V7.03899H2.40343ZM5.76407 5.59418H5.9595V5.47081H5.76407V5.59418Z"
              fill="var(--color-cinza-painel)"
            />
            <path d="M5.76407 5.59418H5.9595V5.47081H5.76407V5.59418Z" fill="currentColor" />
            <path
              d="M9.9209 0.500031V1.70804H11.3242V6.33109H9.9209V7.53909H1.90332V6.33109H0.5V1.70804H1.90332V0.500031H9.9209Z"
              stroke="currentColor"
            />
            <path
              d="M12.5663 7.03896V6.16667V5.29437H12.048H11.6837L11.6837 2.61039H12.048H12.5663V1.8085V1H19.8448V2.20779H21.2483V5.83117H19.8448V7.03896H12.5663ZM5.4595 5.59419H5.66979V5.47081H5.4595V5.59419Z"
              fill="var(--color-cinza-painel)"
            />
            <path d="M5.4595 5.59419H5.66979V5.47081H5.4595V5.59419Z" fill="currentColor" />
            <path
              d="M20.3452 0.5V1.70801H21.7486V6.33105H20.3452V7.53906H12.0659V5.79395H11.1841V2.11035H12.0659V0.5H20.3452ZM6.16946 4.9707V6.09375H4.9595V4.9707H6.16946Z"
              stroke="currentColor"
            />
            <path
              d="M18.9601 4.79633L18.9648 5.71398L17.966 5.71796L17.9698 6.45887L14.9723 6.47081L14.9685 5.7299L13.9697 5.73388L13.9651 4.81623L12.9657 4.82021L12.9595 3.60535L13.9589 3.60137L13.9604 3.89858L14.9592 3.8946L14.9638 4.81225L17.9614 4.80031L17.9567 3.88266L18.9555 3.87868L18.9534 3.47479L19.9528 3.47081L19.9595 4.79235L18.9601 4.79633Z"
              fill="currentColor"
            />
            <path
              d="M8.46014 4.79633L8.4648 5.71398L7.46602 5.71796L7.46979 6.45887L4.47227 6.47081L4.4685 5.7299L3.46972 5.73388L3.46506 4.81623L2.46569 4.82021L2.4595 3.60535L3.45888 3.60137L3.46039 3.89858L4.45917 3.8946L4.46384 4.81225L7.46136 4.80031L7.45669 3.88266L8.45547 3.87868L8.45341 3.47479L9.45278 3.47081L9.4595 4.79235L8.46014 4.79633Z"
              fill="currentColor"
            />
          </g>
        ) : null}
      </svg>
    </span>
  );
}
