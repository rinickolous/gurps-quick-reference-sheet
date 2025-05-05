const parselink = GURPS.parselink
const handlePdf = GURPS.handlePdf

export default class GBQuickReferenceSheet extends GURPS.ActorSheets.character {
  /** @override */
  static DEFAULT_OPTIONS = {
    tag: 'div',
    classes: ['gb-quickref-sheet', 'sheet', 'actor'],
    position: {
      width: 590,
      height: 800,
    },
  }

  /* ---------------------------------------- */

  /** @override */
  static PARTS = {
    main: {
      id: 'sheet',
      template: '/modules/gurps-quick-reference-sheet/templates/gb-quickref-sheet.hbs',
      scrollable: [
        '.gurpsactorsheet',
        '#advantages',
        '#reactions',
        '#melee',
        '#ranged',
        '#skills',
        '#spells',
        '#equipmentcarried',
        '#equipmentother',
        '#notes',
      ],
    },
  }

  /* ---------------------------------------- */

  /** @protected @override */
  async _prepareContext(options) {
    const data = await super._prepareContext(options)

    data.pageref = foundry.utils.getProperty(this.actor, 'flags.gurps.pageref')
    data.copyright = foundry.utils.getProperty(this.actor, 'flags.gurps.copyright') ?? '©2024 Gaming Ballistic, LLC'
    data.torso = this.actor.getTorsoDr()
    data.parryblock = this.actor.getEquippedParry()

    switch (foundry.utils.getProperty(this.actor, 'flags.gurps.book')) {
      case 'NBB':
        data.cssClass = `${data.cssClass} bugstiary`
        break

      case 'NBG':
        data.cssClass = `${data.cssClass} garden`
        break

      case 'NBS':
        data.cssClass = `${data.cssClass} snakes`
        break

      case 'NB':
        data.cssClass = `${data.cssClass} bestiary`
        break

      case 'SB':
        data.cssClass = `${data.cssClass} saethor`
        break

      case 'WK':
        data.cssClass = `${data.cssClass} warlock`
        break
    }

    return data
  }

  /* ---------------------------------------- */

  getCustomHeaderButtons() {
    return []
  }

  /* ---------------------------------------- */

  get gurpsActorData() {
    return this.actor.getGurpsActorData()
  }
  /** @protected @override */
  async _onRender(context, options) {
    await super._onRender(context, options)

    this.element
      .querySelector('.gb-quick-reference')
      .style.setProperty('--labelAcc', `"${game.i18n.localize('GURPS.acc')} "`)
    this.element
      .querySelector('.gb-quick-reference')
      .style.setProperty('--labelBulk', `"${game.i18n.localize('GURPS.bulk')} "`)
    this.element.querySelector('.gb-quick-reference').addEventListener('click', ev => {
      this._onfocus(ev)
    })

    const html = $(this.element)

    html.find('.rollableicon').click(this._onClickRollableIcon.bind(this))
    html.find('.gb-move').click(this._onClickMove.bind(this))
    html.find('.gb-link').click(this._handleOnPdfLink.bind(this))
  }

  async _onClickRollableIcon(ev) {
    ev.preventDefault()
    const element = ev.currentTarget
    const val = element.dataset.value
    const parsed = parselink(val)
    GURPS.performAction(parsed.action, this.actor, ev)
  }

  /* ---------------------------------------- */

  _onClickMove(event) {
    event.preventDefault()
    const value = event.currentTarget.dataset.key
    this.actor.setMoveDefault(value)
  }

  /* ---------------------------------------- */

  _handleOnPdfLink(event) {
    const prefix = foundry.utils.getProperty(this.actor, 'flags.gurps.book')
    handlePdf(prefix + event.currentTarget.innerText)
  }
}
