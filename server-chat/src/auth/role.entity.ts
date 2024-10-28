import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Auth } from './auth.entity';


@Entity('roles')
export class Role extends BaseEntity {

  @PrimaryGeneratedColumn()
  public roleId!: number

  @Column({type: "varchar", length: 255})
  public roleName!: string

  @OneToMany(() => Auth, (auth) => auth.roleId)
  auths: Auth[]
}