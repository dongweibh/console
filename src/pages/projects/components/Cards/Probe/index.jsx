/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react'

import { Tag, List, Panel } from 'components/Base'

import styles from './index.scss'

export default class ProbeCard extends React.Component {
  renderProbe() {
    const { livenessProbe, readinessProbe } = this.props.detail

    if (!livenessProbe && !readinessProbe) return null

    return (
      <div className={styles.probe}>
        {this.renderProbeRecord(readinessProbe, 'readiness')}
        {this.renderProbeRecord(livenessProbe, 'liveness')}
      </div>
    )
  }

  renderProbeRecord(probe, type) {
    if (!probe) return null

    const delay = probe.initialDelaySeconds || 0
    const timeout = probe.timeoutSeconds || 0
    let details = []
    let probeType

    if ('httpGet' in probe) {
      const { path, port, scheme } = probe.httpGet
      probeType = 'HTTP Request Check'
      details = [
        { title: scheme, description: t('Request Type') },
        { title: path, description: t('Path') },
        { title: port, description: t('Port') },
      ]
    } else if ('tcpSocket' in probe) {
      probeType = 'TCP Port Check'
      details = [{ title: probe.tcpSocket.port, description: t('Port') }]
    } else {
      const { command = [] } = probe.exec
      probeType = 'Exec Commnad Check'
      details = [{ title: command.join(' '), description: t('Command') }]
    }

    const title = (
      <>
        <Tag type={type === 'liveness' ? 'warning' : 'primary'}>
          {type === 'liveness' ? t('Liveness Probe') : t('Readiness Probe')}
        </Tag>
        <span className={styles.probeType}>{t(probeType)}</span>
      </>
    )

    const description = (
      <span>
        {t('Initial Delay')}: {delay}s &nbsp;&nbsp;{t('Timeout')}: {timeout}s
      </span>
    )

    return (
      <List.Item
        icon="monitor"
        title={title}
        description={description}
        details={details}
      />
    )
  }

  render() {
    return (
      <Panel title={t('Health Checker')}>
        <div className={styles.wrapper}>{this.renderProbe()}</div>
      </Panel>
    )
  }
}
