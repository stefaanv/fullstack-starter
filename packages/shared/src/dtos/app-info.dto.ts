export class AppInfoDto {
  public appName = 'fullstack-starter'
  public appDescription = 'fullstack-starter description'
  public appAuthor = 'Stefaan Vandevelde'
  public version = 'v0.0.0'
  public commitId = 'unknown'

  setPackageInfo(pkg: { name: string; description: string; author: string; version: string }) {
    this.appName = pkg.name
    this.appAuthor = pkg.author
    this.appDescription = pkg.description
    this.version = pkg.version
  }
}
