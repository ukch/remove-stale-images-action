import { GraphQLClient } from 'graphql-request'

import orgPackagesQuery, { PackagesResponse as OrgPackagesResponse } from './queries/packagesOrg'
import userPackagesQuery, { PackagesResponse as UserPackagesResponse } from './queries/packagesUser'
import deletePackageMutation, { DeletePackageResponse } from './queries/remove_package'

type PackagesResponse = OrgPackagesResponse | UserPackagesResponse

export enum QueryTypes {
  user,
  organization
}

export interface IGHAPI {
  getDockerImages(type: QueryTypes, login: string, names: string[]): Promise<PackagesResponse>
  deletePackage(id: string): Promise<DeletePackageResponse>
}

export default class GHAPI implements IGHAPI {
  private readonly client: GraphQLClient

  constructor(token: string) {
    this.client = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        Accept: 'application/vnd.github.package-deletes-preview+json',
        Authorization: `Bearer ${token}`
      }
    })
  }

  async getDockerImages(type: QueryTypes, login: string, names: string[]): Promise<PackagesResponse> {
    const packagesQuery = type === QueryTypes.user ? userPackagesQuery : orgPackagesQuery
    return this.client.request<PackagesResponse>(packagesQuery, {
      login,
      names
    })
  }

  async deletePackage(id: string): Promise<DeletePackageResponse> {
    return this.client.request<DeletePackageResponse>(deletePackageMutation, {
      id
    })
  }
}
