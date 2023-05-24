import { FrontendConfigDto } from '@nest-vue-starter/shared'

export default function (bec: any): FrontendConfigDto {
  return { test: bec.test, windowTitle: 'Window Title' }
}
