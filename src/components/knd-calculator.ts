import '@material/mwc-button/mwc-button';
import '@material/mwc-icon/mwc-icon';

import { Button } from '@material/mwc-button/mwc-button';
import {
  css,
  customElement,
  html,
  property,
  query,
  PropertyValues
} from 'lit-element';

import { fontSize2x, fontSize3x } from '../util/base-styles';

import { KndWidgetBase } from './knd-widget-base';
import { WidgetSize } from '../util/types';

type Operator = '+' | '-' | '*' | '/';

@customElement('knd-widget-calculator')
export class Calculator extends KndWidgetBase {
  static get styles() {
    const styles = [
      css`
        #title {
          font-size: ${fontSize3x};
          padding-left: 23px;
        }
        mwc-button,
        #display {
          font-size: ${fontSize2x} !important;
        }
        #display {
          display: flex;
          justify-content: space-between;
          padding: 23px;
        }
      `
    ];

    let superStyles = super.styles;
    if (!Array.isArray(superStyles)) {
      superStyles = [superStyles];
    }
    return superStyles.concat(styles);
  }

  @property({ type: Number }) numberInput = 0;
  private resultSoFar = 0;
  private begunTypingNewNumber = true;
  @property({}) displayedOperator: Operator | '' = '';
  private currentOperator: Operator = '+';
  private previousOperator: Operator = '+';
  private previousNumber = 0;
  private originalX = 0;

  @query('#buttons') buttonsFullWidth!: HTMLDivElement | null;
  @query('#buttons span') buttonsWrapper!: HTMLSpanElement | null;

  clear() {
    this.numberInput = 0;
    this.resultSoFar = 0;
    this.begunTypingNewNumber = true;
    this.displayedOperator = '';
    this.currentOperator = '+';
    this.previousOperator = '+';
    this.previousNumber = 0;
  }

  keydownHandler = (event: KeyboardEvent) => {
    this.handleInput(event.key);
  };

  clickHandler = (event: MouseEvent) => {
    for (const elem of event.composedPath()) {
      if (elem instanceof Button) {
        this.handleInput(elem.textContent || '');
        break;
      }
    }
  };

  handleInput(key: string) {
    if (/\d/.test(key)) {
      this.handleNumberInput(+key);
      return;
    }
    switch (key) {
      case '+':
      case '➕':
        this.handleOperator('+');
        return;
      case '-':
      case '➖':
        this.handleOperator('-');
        return;
      case '*':
      case '✖️':
        this.handleOperator('*');
        return;
      case '/':
      case '➗':
        this.handleOperator('/');
        return;
      case '=':
      case 'Enter':
        this.handleOperator('=');
        return;
      case 'Backspace':
        if (this.begunTypingNewNumber) {
          this.numberInput = Math.floor(this.numberInput / 10);
        } else {
          this.numberInput = 0;
          this.begunTypingNewNumber = true;
        }
        return;
      case 'Escape':
      case 'C':
      case 'c':
        this.clear();
        return;
      default:
        console.log(`Unknown key: ${JSON.stringify(key)}`);
    }
  }

  handleNumberInput(digit: number) {
    // If there's no current operator, we're adding a digit onto the current
    // number.
    if (this.begunTypingNewNumber) {
      this.numberInput = this.numberInput * 10 + digit;
    } else {
      this.begunTypingNewNumber = true;
      this.resultSoFar = this.numberInput;
      this.numberInput = digit;
      if (this.displayedOperator === '') {
        this.currentOperator = '+';
      } else {
        this.currentOperator = this.displayedOperator;
      }
      this.displayedOperator = '';
    }
  }

  applyOperation(left: number, right: number, op: Operator) {
    switch (op) {
      case '+':
        return Math.floor(left + right);
      case '-':
        return Math.floor(left - right);
      case '/':
        return Math.floor(left / right);
      case '*':
        return Math.floor(left * right);
      default:
        const never: never = op;
        throw new Error(`Unknown operator: ${never}`);
    }
  }

  handleOperator(operator: Operator | '=') {
    if (operator !== '=') {
      this.previousOperator = operator;
      this.previousNumber = this.numberInput;
    } else if (this.begunTypingNewNumber) {
      this.previousNumber = this.numberInput;
    }

    this.resultSoFar = this.applyOperation(
      this.resultSoFar,
      this.numberInput,
      this.currentOperator
    );
    this.numberInput = this.resultSoFar;
    if (operator === '=') {
      if (!this.begunTypingNewNumber) {
        // all of the above was a no op, but we want to apply the previous
        // operation again
        this.numberInput = this.applyOperation(
          this.resultSoFar,
          this.previousNumber,
          this.previousOperator
        );
      }
      this.displayedOperator = '';
      this.currentOperator = '+';
      this.resultSoFar = 0;
    } else {
      this.displayedOperator = operator;
    }
    this.begunTypingNewNumber = false;
  }

  constructor() {
    super();
    if (!this.hasAttribute('tabindex')) {
      // Choose one of the following lines (but not both):
      this.tabIndex = 0;
    }
  }

  protected resizeListener = () => {
    const full = this.buttonsFullWidth;
    const wrapper = this.buttonsWrapper;
    if (!full || !wrapper) {
      return;
    }

    const fullRect = full.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    const fullX = ((fullRect as unknown) as ClientRect).width;
    let wrapperX = this.originalX;
    if (!this.originalX) {
      wrapperX = ((wrapperRect as unknown) as ClientRect).width;
      this.originalX = wrapperX;
    }

    const scale = fullX / wrapperX;
    wrapper.style.zoom = '' + scale;
  };

  async updated(changedProps: PropertyValues) {
    const sizeChanged = changedProps.has('size');

    if (sizeChanged) {
      const oldSize = changedProps.get('size') as WidgetSize | undefined;
      const newSize = this.size;

      if (oldSize === 'large') {
        window.removeEventListener('reset', this.resizeListener);
        const wrapper = this.buttonsWrapper;
        if (wrapper) {
          wrapper.style.zoom = '1';
        }
      }

      if (newSize === 'large') {
        await this.firstUpdated;
        this.resizeListener();
        window.addEventListener('resize', this.resizeListener, {
          passive: true
        });
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.keydownHandler);
    this.addEventListener('click', this.clickHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.keydownHandler);
    this.removeEventListener('click', this.clickHandler);

    window.removeEventListener('reset', this.resizeListener);
  }

  renderTiny() {
    return html`
      <mwc-icon>dialpad</mwc-icon>
    `;
  }

  renderSmall() {
    return html`
      <mwc-icon slot="icon">dialpad</mwc-icon>
      <div slot="label">Calculon</div>
    `;
  }

  renderMedium() {
    return html`
      <div id="title">Calculon</div>
      <div id="display">
        <div>${this.displayedOperator}</div>

        <div>${this.numberInput.toLocaleString()}</div>
      </div>
      <div id="buttons">
        <span>
          <mwc-button>7</mwc-button>
          <mwc-button>8</mwc-button>
          <mwc-button>9</mwc-button>
          <mwc-button>/</mwc-button>
          <br />
          <mwc-button>4</mwc-button>
          <mwc-button>5</mwc-button>
          <mwc-button>6</mwc-button>
          <mwc-button>*</mwc-button>
          <br />
          <mwc-button>1</mwc-button>
          <mwc-button>2</mwc-button>
          <mwc-button>3</mwc-button>
          <mwc-button>-</mwc-button>
          <br />
          <mwc-button>0</mwc-button>
          <mwc-button disabled> </mwc-button>
          <mwc-button>=</mwc-button>
          <mwc-button id="last">+</mwc-button>
        </span>
      </div>
    `;
  }

  renderLarge() {
    return this.renderMedium();
  }
}
